const Expense = require('../models/expense');
const path = require('path');
const rootDir = require('../util/path');
const User = require('../models/user');
const Userservices = require('../services/userservices');
const s3services = require('../services/s3services')

exports.createExpense = async (req,res,next) => {
    const { expenseAmt, description, category } = req.body;
        try {
            if(expenseAmt == '' || description == '' || category == ''){
                return res.status(400).json({ error: 'Please fill details'});
            }
    
            const data = await req.user.createExpense({
               expenseAmt,
               description,
               category
            });
            res.status(201).json({expenseCreated: data});
            // res.json({expenseCreated: expense});
            
        } catch (error) { 
            console.log(error)
            res.status(500).json({ error: error})
         }
    }


exports.getExpenses = async (req,res,next) => {
    let page = req.params.pageNo || 1;

    console.log(page)

    let Items_Per_Page = +(req.body.Items_Per_Page) || 5;

    console.log(Items_Per_Page)
    let totalItems;

    try {
        let count = await Expense.count({where: {userId:req.user.id}})
        totalItems = count;

        let data = await req.user.getExpenses({offset: (page-1)*Items_Per_Page,limit: Items_Per_Page})

        res.status(200).json({
            data,
            info: {
                currentPage: page,
                hasNextPage: totalItems > page * Items_Per_Page,
                hasPreviousPage: page > 1,
                nextPage: +page + 1,
                previuosPage: +page - 1,
                lastPage: Math.ceil(totalItems / Items_Per_Page) 
            }
        })
    } catch (error) {
        console.log(err);
        res.status(500).json({error:error});
    }
}

exports.getAllUsers = async(req,res,next)=>{
    try {
        console.log(req.user.ispremiumuser);

        if(req.user.ispremiumuser){
            console.log("into getall Users");
            let leaderboard = [];
            let users = await User.findAll({attributes: ['id', 'username', 'email']})

            console.log(users);

            for(let i = 0 ;i<users.length ; i++){
                let expenses = await  users[i].getExpenses() ;

                console.log(users[i]);
                console.log(expenses);
                let totalExpense = 0;
                for(let j = 0 ;j<expenses.length ; j++){
                    totalExpense += expenses[j].expenseAmt

                }
                console.log(totalExpense);
                let userObj = {
                    user:users[i],
                    expenses,
                    totalExpense
                }
                leaderboard.push(userObj);
            }
           return res.status(200).json({success : true, data : leaderboard});
        }

        return res.status(400).json({message : 'user is not premium user' });

    } catch (error) {
        res.status(500).json({success : false, data : error});
    }
}

exports.getInfoForPremiumUsers = async (req,res,next) => {
    try{
        if(req.user.ispremiumuser){
            const userId = req.params.clickedUserId;
            const user = await User.findOne({where:{id: userId}})
    
            const expenses = await user.getExpenses();
            return res.status(200).json({success:true , data: expenses })
        }

    }
    catch(error){
        return res.status(500).json({success : false, data : error});
    }
}


exports.deleteExpense = async (req,res,next) => {
    try {
        let userId = req.params.userId; //user can only delete his data not others
        if(!userId) {
            res.status(400).json({ error: 'id missing for userId' });
        }
        
        await req.user.getExpenses({ where:{ id: userId} }).then(expense => {
            let findExpenses = expense[0]
            findExpenses.destroy();
            res.sendStatus(200);
        })
        
    }catch(err) {
        console.log(err)
        res.status(500).json('error occured')
    };
}

exports.downloadExpense = async (req,res,next) => {
    try {
        const expense = await Userservices.getExpenses(req);

        console.log(expense)
    
        const stringifiedExpense = JSON.stringify(expense)
        const userId = req.user.id;


    
        const filename = `Expense${userId}/${new Date()}.txt`
    
        const fileURL = await s3services.uploadToS3(stringifiedExpense,filename)
    
        const downloadUrlData = await req.user.createDownloadUrl({
            fileURL: fileURL,
            filename
        })
    
        res.status(200).json({fileURL, downloadUrlData, success: true});
    } catch (error) {
        res.status(500).json({fileURL: '', success:false})
    }

}

exports.downloadAllUrl = async(req,res,next) => {
    try {
        let urls = await req.user.getDownloadUrls();
        if(!urls){
            res.sttus(404).json({ message: 'no urls found'})
        }
        res.status(200).json({ urls, success: true})
    } catch (error) {
        res.status(500).json({error})
    }
}