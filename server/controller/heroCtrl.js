// const connection = require('../dbConfig')

// const heroCtrl = {

//     get_hero_data : async (req, res) =>{
//         connection.query('select wallet_address from hero_data',(error, rows) => {
//             if(error) throw error;
//             //res.send(rows);
//             console.log(rows)
//         })
//     },
//     insert_WalletAddress : async (req, res) => {
//         const id = req.body.myAddres;
//         const sql = `insert into hero_data(wallet_address) values(?);`
        
//         connection.query(
//             sql,[id], (error, rows) => {
//                 if(error) throw error;
//                 console.log(rows)
//             }
//         )
//     }

// }

// module.exports = heroCtrl