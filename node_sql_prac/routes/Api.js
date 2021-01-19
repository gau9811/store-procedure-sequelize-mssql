let app = require('express')
let router = app.Router()
let User = require('../models').Users
let bcrypt = require('bcrypt')
  let moment = require('moment')

router.post('/createAcc' , async (req, res) => {

  const {firstName,lastName,email,password} = req.body

  if (email.length == 0 && lastName.length == 0 && email.length == 0 && password.length == 0) {
    res.json({err:"fields should not be empty"})
  }
 
    let findUser = await User.findOne({
      where: {
        email:email
      }
    })


    if (findUser && findUser.email !== null) {
      res.json({err:"user Already exist"})
    }

    if (findUser == null) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(password, salt);
      const createdAt = moment().format('YYYY-MM-DD')
      const updatedAt = moment().format('YYYY-MM-DD')

      await User.sequelize.query(`exec createUser('${firstName}','${lastName}','${email}','${hashPassword}','${createdAt}','${updatedAt}')`)
     .then(() => res.status(201).json({msg:"user created"}))
     .catch((err)=>res.json({err:`user cannot be created ${err}`}))    
  
    }
})

router.get('/getAllUser', async (req,res)=>{
   let getAllUser = await User.findAll()

   try {
     if (getAllUser.length !== 0) {
       res.json({msg:getAllUser})
     }

     if (getAllUser.length == 0) {
       res.json({err:"there is no user exist"})
     }
   } catch (err) {
     res.json({err:err})
   }
})

router.put('/user/update', async (req,res)=>{
 
  const {email,lastName,firstName} = req.body


  if (email && email.length == 0 || !email || email === undefined) {
    res.json({err:"fields should not be empty"})
  }
  
  let updatingUser = await User.findAll({
    where:{
      email:email
    }
  })
 
  

  try {
    if (updatingUser.length !== 0) {

      if ( updatingUser[0].firstName === firstName || updatingUser[0].lastName === firstName) {
        res.json({msg:"user already updated"})
      }

      const createdAt = moment(updatingUser[0].createdAt).format('YYYY-MM-DD')
      const updatedAt = moment().format('YYYY-MM-DD')

      await User.sequelize.query(`CALL updateUser('${!firstName ? firstName : updatingUser[0].firstName}','${lastName ? lastName :updatingUser[0].lastName}','${updatingUser[0].email}','${createdAt}','${updatedAt}')`)
      .then(()=>res.status(200).json({msg:"user updated"}))
      .catch((err)=>res.status(401).json({err:err}))
     
  
    }else{
      res.json({msg:`there is no user exist ${email}`})
    }
 } catch (err) {
    res.status(500).json({err:"Something went wrong"})
 }

 
})


router.delete('/user/delete', async (req, res)=>{

  let { email } = req.body

  
  if (email && email.length == 0 || !email || email === undefined) {
    res.json({err:"fields should not be empty"})
  }

    let findUser = await User.findAll({
      where:{
        email:email
      }
    })

    try {
        if (findUser.length !== 0) {
         
          await User.sequelize.query(`exec deleteUser('${email}')`)
          .then(()=>res.status(200).json({msg:"user has been deleted"}))
          .catch((err)=>res.status(500).json({err:err}))
  
      }else{
        res.status(403).json({err:"user does not exist"})
      }
    } catch (err) {
      res.json({err:err})
    }
})

router.put('/user/updateEmail',async (req, res)=>{
 const {email,id} = req.body
 
 if (!id || id === undefined) {
  res.json({err:"fields should not be empty"}) 
 }

 if (email && email.length == 0 || !email || email === undefined ) {
  res.json({err:"fields should not be empty"})
}

   const findUser = await User.findAll({
     where: {
       id:id
     }
   })

  
   try {
     if (findUser.length !== 0) {
       await User.sequelize.query(`CALL updateEmail('${email}','${id}')`)
       .then(()=>res.status(200).json({msg:`email updated successfully`}))
       .catch((err)=>res.status(500).json({err:err}))
     }else{
       res.json({err:`user doesn't exist with id ${id}`})
     }

   } catch (err) {
     
   }

})

router.put('/user/updatePass',async (req, res)=>{
  const {email,password} = req.body
  
  if (password && password.length == 0 || !password || password === undefined) {
   res.json({err:"fields should not be empty"}) 
  }
 
  if (email && email.length == 0 || !email || email === undefined) {
   res.json({err:"fields should not be empty"})
 }
 
    const findUser = await User.findAll({
      where: {  
        email:email
      }
    })
 
   
    try {
      if (findUser.length !== 0) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt);
        await User.sequelize.query(`exec updatePassword('${email}','${hashPassword}')`)
        .then(()=>res.status(200).json({msg:`password updated successfully`}))
        .catch((err)=>res.status(500).json({err:err}))
      }else{
        res.json({err:`user doesn't exist with id ${id}`})
      }
 
    } catch (err) {
      res.status(500).json({err:"something went wrong"})
    }
 
 })


module.exports = router
