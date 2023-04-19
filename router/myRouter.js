//Setting Routing
const express = require('express')
const router = express.Router()
// use Model
const { Member,
        Product,
        Brand,
        saveData,
      } = require('../models/connect')
// File
const fs = require('fs');
const multer = require('multer')
const storage = multer.diskStorage({
  destination:function(req,file,cd){
    cd(null,'./public/image/product/') // ตำแหน่งจัดเก็บไฟล์
  },
  filename:function(req,file,cd){
    cd(null,Date.now()+'.jpg') //เปลี่ยนเชื่อไฟล์ ป้องกันชื่อซ้ำ
  }
})
const upload = multer({ storage:storage })

// CartItems
router.get('/carts', (req,res)=>{
  const cart = req.session.cart || [];
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  let sumPrice = 0;
  cart.forEach(item => {
    sumPrice += item.priceProduct * item.quantity;
  });
  res.render('carts',{cart,cartQuantity,sumPrice})
})

router.get('/addCarts/:ProductID', async (req,res)=>{
  const cart = req.session.cart || [];
  const productID = req.params.ProductID;
  const query = await Product.aggregate([
    {
      $match:
        {
          idProduct: productID,
        }
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandProduct",
        foreignField: "idBrand",
        as: "brand",
      }
    }
  ]);
  const existingItem = cart.find(item => item.idProduct === productID);
  let totalQuantity = 0;
  let sumPrice = 0;
  if (query) {
    const {quantityProduct} = query[0];
    if (existingItem) {
      if (existingItem.quantity + 1 <= quantityProduct) {
        existingItem.quantity += 1;
      } else {
        return res.status(400).json({ error: `สินค้า ${existingItem.nameProduct} มีจำนวนคงเหลือไม่เพียงพอ` });
      }
    } else {
      cart.push(Object.assign({}, query[0], {quantity: 1}));
    }
    req.session.cart = cart;
    cart.forEach(item => {
      totalQuantity += item.quantity;
      sumPrice += item.priceProduct * item.quantity;
    });
    req.session.quantity = totalQuantity;
    req.session.sumPrice = sumPrice;
    res.json({cart,totalQuantity,sumPrice});
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
})

router.post('/carts/delete/:productID' , (req,res)=>{
    const cart = req.session.cart || [];
    const productID = req.params.productID
    let index = cart.findIndex(function(item) {
      return item.idProduct == productID;
    });
    if (index !== -1) {
      cart.splice(index, 1);
      res.send("ลบสินค้าชิ้นนี้");
    } else {
      res.send("ไม่สามารถลบสินค้าชิ้นนี้ได้");
    }
})

router.post('/carts/destroy' , (req,res)=>{
  req.session.destroy((err) => {
    if (err) {
      const message = 'ไม่สามารถลบสินค้าในตะกร้าได้'
      res.status(400).send(message);
    }else{
      const message = 'ลบสินค้าในตะกร้า เรียบร้อยแล้ว'
      res.status(200).send(message);
    }
  });
})

// Index

router.get('/', async (req,res)=>{
  const cart = req.session.cart || [];
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const query = await Product.aggregate([
    {
      $match:
        {
          quantityProduct: { $gt: 0 }
        }
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandProduct",
        foreignField: "idBrand",
        as: "brand",
      }
    }
  ])
    res.render('index',{query,cart,cartQuantity})
})

router.get('/male',async (req,res)=>{
  const cart = req.session.cart || [];
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const query = await Product.aggregate([
    {
      $match:
        {
          sex:'รองเท้าผู้ชาย',
          quantityProduct: { $gt: 0 }
        }
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandProduct",
        foreignField: "idBrand",
        as: "brand",
      }
    }
  ])
  res.render('male',{query,cart,cartQuantity})
})

router.get('/female',async (req,res)=>{
  const cart = req.session.cart || [];
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const query = await Product.aggregate([
    {
      $match:
        {
          sex:'รองเท้าผู้หญิง',
          quantityProduct: { $gt: 0 }
        }
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandProduct",
        foreignField: "idBrand",
        as: "brand",
      }
    }
  ])
  res.render('female',{query,cart,cartQuantity})
})

// Admin
router.get("/admin", async (req,res)=>{
  try{
    const status =  req.session.status
    if(status === "administrator"){
      const query = await Member.find();
      res.render('admin/member', {query})
    }else{
      res.redirect('../login')
    }
  } catch(err){
    console.error(err)
    res.status(400).send("Internal Server Error")
  }
})

router.post('/admin/member/insert', async (req, res) => {
    try {
      const data = new Member({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        sex: req.body.sex,
        status: req.body.status
      })
      const insert = await saveData(data)
      if(insert){
        const message = 'เพิ่มสมาชิกเสร็จสิ้น'
        res.status(200).send(message);
      }else{
        const message = 'ไม่สามารถพิ่มสมาชิกได้'
        res.status(400).send(message);
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Error you cannot insert member");
    }
});

router.post('/admin/member/edit',async (req,res)=>{
  try{
    const status =  req.session.status
    if(status === "administrator"){
      const edit = req.body.edit
      const query = await Member.findOne({_id:edit}).exec()
      res.render('admin/member-edit',{member:query})
    }else{
      res.redirect('../../login')
    }
  }catch (err) {
    console.error(err)
    res.status(500).send("Error you cannot query data for user")
  }
})

router.post('/admin/member/update',async (req,res)=>{
  try{
    const user = req.body.id
    const data = ({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      sex: req.body.sex,
      status: req.body.status
    })
    const update = await Member.findByIdAndUpdate(user,data,{useFindAndModify:false})
    if(update){
      const message = 'อัพเดทข้อมูลเสร็จสิ้น'
      res.status(200).send(message);
    }else{
      const message = 'อัพเดทข้อมูลไม่ได้'
      res.status(400).send(message);
    }
  }catch(err){
    console.error(err)
    res.status(400).send("Error you cannot Update member")
  }
})

router.get("/admin/member/delete/:id", async (req, res) => {
     try {
      const deleteID = req.params.id    
      await Member.findByIdAndDelete(deleteID, {useFindAndModify: false});
      res.redirect('/admin/member');
    } catch (err) {
      console.log(err);
      res.status(400).send("Error delete member");
    }
  });

// Admin Order
router.get('/admin/order',(req,res)=>{
    const status =  req.session.status
    if(status === "administrator"){
      res.render('admin/order')
    }else{
      res.redirect('../login')
    }
})

// Admin Brand
router.get('/admin/brand', async (req,res)=>{
  try{
    const status =  req.session.status
    if(status === "administrator"){
      const query = await Brand.find();
      res.render('admin/brand', {query})
    }else{
      res.redirect('../login')
    }
  } catch(err){
    console.log(err)
    res.status(400).send('Error you cannot insert Brand')
  }
});

router.post('/admin/brand/insert', async (req,res)=>{
  try{
    const data = new Brand({
      idBrand:req.body.idBrand,
      nameBrand:req.body.nameBrand
    })
    const insert = await saveData(data)
    if(insert){
      const message = 'เพิ่มแบร์นสินค้าเสร็จสิ้น'
      res.status(200).send(message)
    }else{
      const message = 'ไม่เพิ่มแบร์นสินค้าได้'
      res.status(400).send(message)
    }
  } catch(err){
    console.log(err)
    res.status(400).send('Error you cannot insert Brand')
  }
});

router.post('/admin/brand/edit', async (req,res)=>{
  try{
    const status =  req.session.status
    if(status === "administrator"){
      const edit = req.body.id
      const query = await Brand.findOne({_id:edit}).exec()
      res.render('admin/brand-edit', {brand:query})
    }else{
      res.redirect('../../login')
    }
  } catch(err){
    console.log(err)
    res.status(400).send('Error you cannot insert Brand')
  }
});

router.post('/admin/brand/update', async (req,res)=>{
  try{
    const brand = req.body.id
    const data = ({
      idBrand:req.body.idBrand,
      nameBrand:req.body.nameBrand
    })
    const update = await Brand.findByIdAndUpdate(brand,data,{useFindAndModify:false})
    if(update){
      const message = 'อัพเดทแบร์นสินค้าเสร็จสิ้น'
      res.status(200).send(message)
    }else{
      const message = 'ไม่สามารถอัพเดทแบร์นสินค้าได้'
      res.status(400).send(message)
    }
  } catch(err){
    console.log(err)
    res.status(400).send('Error you cannot insert Brand')
  }
});

// Admin Product
router.get('/admin/product', async (req,res)=>{
  try{
    const status =  req.session.status
    if(status === "administrator"){
      const queryBrand = await Brand.find();
      const queryProduct = await Product.aggregate([
        {
          $lookup: {
            from: "brands",
            localField: "brandProduct",
            foreignField: "idBrand",
            as: "brand",
          },
        }
      ]);
      res.render('admin/product', {queryBrand,queryProduct})
    }else{
      res.redirect('../login')
    }
  } catch(err){
    console.log(err)
    res.status(400).send('Error you cannot query Product')
  }
})

router.post('/admin/product/insert',upload.single('imageProduct'), async (req,res)=>{
  try{
    const fileData = ({
      brandProduct:req.body.brandProduct,
      nameProduct:req.body.nameProduct,
      imageProduct:req.file.filename
    })
    const idProduct = req.body.idProduct
    const check = await Product.findOne({idProduct:idProduct}).exec()
    if(idProduct === check.idProduct){
      const pathOld = `./public/image/product/${fileData.imageProduct}`
      fs.unlink(pathOld, (err) => {
        if (err) throw err;
      });
      const message = 'ไม่เพิ่มสามารถสินค้าได้'
      res.status(400).send(message)
    }else{
      const pathOld = `./public/image/product/${fileData.imageProduct}`
      const pathNew = `./public/image/product/${fileData.brandProduct}/${fileData.nameProduct}/${fileData.imageProduct}`
      const pathBrand = `./public/image/product/${fileData.brandProduct}`;
      const pathProduct = `./public/image/product/${fileData.brandProduct}/${fileData.nameProduct}`
      if (!fs.existsSync(pathBrand)) {
        fs.mkdirSync(pathBrand);
        if(!fs.existsSync(pathProduct)){
          fs.mkdirSync(pathProduct);
        }
      } else {
        if(!fs.existsSync(pathProduct)){
          fs.mkdirSync(pathProduct);
        }
      }
      fs.rename(pathOld, pathNew, (err) => {
        if (err) throw err;
      });
      const data = new Product({
        idProduct:req.body.idProduct,
        brandProduct:req.body.brandProduct,
        nameProduct:req.body.nameProduct,
        sizeProduct:req.body.sizeProduct,
        priceProduct:req.body.priceProduct,
        sex:req.body.sex,
        imageProduct:req.file.filename,
        quantityProduct:0
      })
      const insert = await saveData(data);
        if(insert){
          const message = 'เพิ่มสินค้าเสร็จสิ้น'
          res.status(200).send(message)
        }else{
          const message = 'ไม่เพิ่มสามารถสินค้าได้'
          res.status(400).send(message)
        }
    }
  }catch(err){
    console.log(err)
    res.status(400).send('Error you cannot insert Product')
  }
})

router.post('/admin/product/edit', async (req,res)=>{
  try{
    const status =  req.session.status
    if(status === "administrator"){
      const idProduct = req.body.idProduct
      const queryBrand = await Brand.find();
      const queryProduct = await Product.aggregate([
        {
          $match:
            {
              idProduct: idProduct,
            }
        },
        {
          $lookup: {
            from: "brands",
            localField: "brandProduct",
            foreignField: "idBrand",
            as: "brand",
          }
        }
      ]);
      res.render('admin/product-edit', {queryBrand,product:queryProduct})
    }else{
      res.redirect('../../login')
    }
  } catch(err){
    console.log(err)
    res.status(400).send('Error you cannot query Product')
  }
})

router.post('/admin/product/updateOldPic', async (req,res) =>{
  try{
    const idProductOld = req.body.idProductOld
    const idProduct = req.body.idProduct
    const check = await Product.findOne({idProduct:idProduct}).exec()
    if(idProduct === idProductOld){
      console.log(idProductOld)
    console.log(idProduct)
      const updateID = req.body.id
      const dataOld = {
        nameOld:req.body.nameOld,
        brandOld:req.body.brandOld
      }
      const data = ({
        idProduct:req.body.idProduct,
        brandProduct:req.body.brandProduct,
        nameProduct:req.body.nameProduct,
        sizeProduct:req.body.sizeProduct,
        priceProduct:req.body.priceProduct,
        sex:req.body.sex,
        quantityProduct:req.body.quantityProduct,
        imageProduct:req.body.imageProduct
      })
      const pathBrand = `./public/image/product/${data.brandProduct}`; //ที่อยู่โฟรเดอร์แบรนด์
      const pathProduct = `./public/image/product/${data.brandProduct}/${data.nameProduct}` //ที่อยู่โฟรเดอร์สินค้า
      const pathOld = `./public/image/product/${dataOld.brandOld}/${dataOld.nameOld}/${data.imageProduct}` //ที่อยู่โฟรเดอร์สินค้าเริ่มต้น
      const pathImageOld = `./public/image/product/${dataOld.brandOld}/${data.nameProduct}/${data.imageProduct}` //ที่อยู่โฟรเดอร์รูปสินค้าเก่า
      const pathImageNew = `./public/image/product/${data.brandProduct}/${data.nameProduct}/${data.imageProduct}` //ที่อยู่โฟรเดอร์รูปสินค้าใหม่
      const pathNameOld =  `./public/image/product/${dataOld.brandOld}/${dataOld.nameOld}` //ที่อยู่ชื่อโฟรเดอร์สินค้าเก่า
      const pathNameNew =  `./public/image/product/${data.brandProduct}/${data.nameProduct}` //ที่อยู่ชื่อโฟรเดอร์สินค้าใหม่
  
      if(dataOld.nameOld === data.nameProduct && dataOld.brandOld === data.brandProduct){ // ชื่อ และ แบรนด์ เดิม
        const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
        if(update){
              const message = 'อัพเดทสินค้าเสร็จสิ้น'
              res.status(200).send(message)
            }else{
              const message = 'ไม่สามารถอัพเดทสินค้าได้'
              res.status(400).send(message)
            }
        }else if(dataOld.nameOld === data.nameProduct && dataOld.brandOld !== data.brandProduct){ // ชื่อเดิม และ แบรนด์ใหม่
          if (!fs.existsSync(pathBrand)) {
            fs.mkdirSync(pathBrand);
            if(!fs.existsSync(pathProduct)){
              fs.mkdirSync(pathProduct);
            }
          } else {
            if(!fs.existsSync(pathProduct)){
              fs.mkdirSync(pathProduct);
            }
          }
          fs.rename(pathImageOld, pathImageNew, (err) => {
            if (err) throw err;
          });
          fs.rmSync(pathNameOld, { recursive: true }); // ลบโฟรเดอร์
          const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
          if(update){
            const message = 'อัพเดทสินค้าเสร็จสิ้น'
              res.status(200).send(message)
            }else{
              const message = 'ไม่สามารถอัพเดทสินค้าได้'
              res.status(400).send(message)
            }
        }else if(dataOld.nameOld !== data.nameProduct && dataOld.brandOld === data.brandProduct){ // ชื่อใหม่ และ แบรนด์เดิม
          fs.rename(pathNameOld, pathNameNew, (err) => {
            if (err) throw err;
          });
          const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
          if(update){
            const message = 'อัพเดทสินค้าเสร็จสิ้น'
              res.status(200).send(message)
            }else{
              const message = 'ไม่สามารถอัพเดทสินค้าได้'
              res.status(400).send(message)
            }
        }else{ // ชื่อใหม่ และ แบรนด์ใหม่
            if (!fs.existsSync(pathBrand)) {
              fs.mkdirSync(pathBrand);
              if(!fs.existsSync(pathProduct)){
                fs.mkdirSync(pathProduct)
                }
              }else {
                if(!fs.existsSync(pathProduct)){
                  fs.mkdirSync(pathProduct);
                  }
              }
              fs.rename(pathOld, pathImageNew, (err) => {
                if (err) throw err;
              });
              fs.rmSync(pathNameOld, { recursive: true }); // ลบโฟรเดอร์
              const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
              if(update){
                const message = 'อัพเดทสินค้าเสร็จสิ้น'
                  res.status(200).send(message)
                }else{
                  const message = 'ไม่สามารถอัพเดทสินค้าได้'
                  res.status(400).send(message)
                }
            }
      }else if(!check){
        const updateID = req.body.id
        const dataOld = {
          nameOld:req.body.nameOld,
          brandOld:req.body.brandOld
        }
        const data = ({
          idProduct:req.body.idProduct,
          brandProduct:req.body.brandProduct,
          nameProduct:req.body.nameProduct,
          sizeProduct:req.body.sizeProduct,
          priceProduct:req.body.priceProduct,
          sex:req.body.sex,
          quantityProduct:req.body.quantityProduct,
          imageProduct:req.body.imageProduct
        })
        const pathBrand = `./public/image/product/${data.brandProduct}`; //ที่อยู่โฟรเดอร์แบรนด์
        const pathProduct = `./public/image/product/${data.brandProduct}/${data.nameProduct}` //ที่อยู่โฟรเดอร์สินค้า
        const pathOld = `./public/image/product/${dataOld.brandOld}/${dataOld.nameOld}/${data.imageProduct}` //ที่อยู่โฟรเดอร์สินค้าเริ่มต้น
        const pathImageOld = `./public/image/product/${dataOld.brandOld}/${data.nameProduct}/${data.imageProduct}` //ที่อยู่โฟรเดอร์รูปสินค้าเก่า
        const pathImageNew = `./public/image/product/${data.brandProduct}/${data.nameProduct}/${data.imageProduct}` //ที่อยู่โฟรเดอร์รูปสินค้าใหม่
        const pathNameOld =  `./public/image/product/${dataOld.brandOld}/${dataOld.nameOld}` //ที่อยู่ชื่อโฟรเดอร์สินค้าเก่า
        const pathNameNew =  `./public/image/product/${data.brandProduct}/${data.nameProduct}` //ที่อยู่ชื่อโฟรเดอร์สินค้าใหม่
    
        if(dataOld.nameOld === data.nameProduct && dataOld.brandOld === data.brandProduct){ // ชื่อ และ แบรนด์ เดิม
          const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
          if(update){
                const message = 'อัพเดทสินค้าเสร็จสิ้น'
                res.status(200).send(message)
              }else{
                const message = 'ไม่สามารถอัพเดทสินค้าได้'
                res.status(400).send(message)
              }
          }else if(dataOld.nameOld === data.nameProduct && dataOld.brandOld !== data.brandProduct){ // ชื่อเดิม และ แบรนด์ใหม่
            if (!fs.existsSync(pathBrand)) {
              fs.mkdirSync(pathBrand);
              if(!fs.existsSync(pathProduct)){
                fs.mkdirSync(pathProduct);
              }
            } else {
              if(!fs.existsSync(pathProduct)){
                fs.mkdirSync(pathProduct);
              }
            }
            fs.rename(pathImageOld, pathImageNew, (err) => {
              if (err) throw err;
            });
            fs.rmSync(pathNameOld, { recursive: true }); // ลบโฟรเดอร์
            const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
            if(update){
              const message = 'อัพเดทสินค้าเสร็จสิ้น'
                res.status(200).send(message)
              }else{
                const message = 'ไม่สามารถอัพเดทสินค้าได้'
                res.status(400).send(message)
              }
          }else if(dataOld.nameOld !== data.nameProduct && dataOld.brandOld === data.brandProduct){ // ชื่อใหม่ และ แบรนด์เดิม
            fs.rename(pathNameOld, pathNameNew, (err) => {
              if (err) throw err;
            });
            const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
            if(update){
              const message = 'อัพเดทสินค้าเสร็จสิ้น'
                res.status(200).send(message)
              }else{
                const message = 'ไม่สามารถอัพเดทสินค้าได้'
                res.status(400).send(message)
              }
          }else{ // ชื่อใหม่ และ แบรนด์ใหม่
              if (!fs.existsSync(pathBrand)) {
                fs.mkdirSync(pathBrand);
                if(!fs.existsSync(pathProduct)){
                  fs.mkdirSync(pathProduct)
                  }
                }else {
                  if(!fs.existsSync(pathProduct)){
                    fs.mkdirSync(pathProduct);
                    }
                }
                fs.rename(pathOld, pathImageNew, (err) => {
                  if (err) throw err;
                });
                fs.rmSync(pathNameOld, { recursive: true }); // ลบโฟรเดอร์
                const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
                if(update){
                  const message = 'อัพเดทสินค้าเสร็จสิ้น'
                    res.status(200).send(message)
                  }else{
                    const message = 'ไม่สามารถอัพเดทสินค้าได้'
                    res.status(400).send(message)
                  }
              }
      }else{
        const message = 'ไม่เพิ่มสามารถสินค้าได้'
        res.status(400).send(message)
      }
    }catch(err){
    console.error(err)
    res.status(400).send("Error you cannot update product")
  }
})

router.post('/admin/product/updateNewPic',upload.single('imageProduct'), async (req,res) =>{
  try{
    let updateID = req.body.id
    let dataOld = {
      nameOld:req.body.nameOld,
      brandOld:req.body.brandOld,
      OldPic:req.body.OldPic
    }
    const data = ({
      idProduct:req.body.idProduct,
      brandProduct:req.body.brandProduct,
      nameProduct:req.body.nameProduct,
      sizeProduct:req.body.sizeProduct,
      priceProduct:req.body.priceProduct,
      sex:req.body.sex,
      quantityProduct:req.body.quantityProduct,
      imageProduct:req.file.filename
    })
    const pathImage = `./public/image/product/${data.imageProduct}` //ที่อยู่โฟรเดอร์รูปสินค้าเริ่มต้น
    const pathBrand = `./public/image/product/${data.brandProduct}`; //ที่อยู่โฟรเดอร์แบรนด์
    const pathProduct = `./public/image/product/${data.brandProduct}/${data.nameProduct}` //ที่อยู่โฟรเดอร์สินค้า
    const pathOld = `./public/image/product/${dataOld.brandOld}/${dataOld.nameOld}/${dataOld.OldPic}` //ที่อยู่โฟรเดอร์สินค้าเริ่มต้น
    const pathImageOld = `./public/image/product/${dataOld.brandOld}/${data.nameProduct}/${dataOld.OldPic}` //ที่อยู่โฟรเดอร์รูปสินค้าเก่า
    const pathImageNew = `./public/image/product/${data.brandProduct}/${data.nameProduct}/${data.imageProduct}` //ที่อยู่โฟรเดอร์รูปสินค้าใหม่
    const pathNameOld =  `./public/image/product/${dataOld.brandOld}/${dataOld.nameOld}` //ที่อยู่ชื่อโฟรเดอร์สินค้าเก่า
    const pathNameNew =  `./public/image/product/${data.brandProduct}/${data.nameProduct}` //ที่อยู่ชื่อโฟรเดอร์สินค้าใหม่

    if(dataOld.nameOld === data.nameProduct && dataOld.brandOld === data.brandProduct){ // ชื่อ และ แบรนด์ เดิม  
        fs.rename(pathImage, pathImageNew, (err) => {
          if (err) throw err;
        });
        fs.unlink(pathOld, (err) => {
          if (err) throw err;
        });
        const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
        if(update){
            const message = 'อัพเดทสินค้าเสร็จสิ้น'
            res.status(200).send(message)
          }else{
            const message = 'ไม่สามารถอัพเดทสินค้าได้'
            res.status(400).send(message)
          }
      }else if(dataOld.nameOld === data.nameProduct && dataOld.brandOld !== data.brandProduct){ // ชื่อเดิม และ แบรนด์ใหม่ 
        if (!fs.existsSync(pathBrand)) {
          fs.mkdirSync(pathBrand);
          if(!fs.existsSync(pathProduct)){
            fs.mkdirSync(pathProduct);
          }
        } else {
          if(!fs.existsSync(pathProduct)){
            fs.mkdirSync(pathProduct);
          }
        }
        fs.rename(pathImage, pathImageNew, (err) => {
          if (err) throw err;
        });
        fs.unlink(pathOld, (err) => {
          if (err) throw err;
        });
        fs.rmSync(pathNameOld, { recursive: true }); // ลบโฟรเดอร์
        const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
        if(update){
          const message = 'อัพเดทสินค้าเสร็จสิ้น'
            res.status(200).send(message)
          }else{
            const message = 'ไม่สามารถอัพเดทสินค้าได้'
            res.status(400).send(message)
          }
      }else if(dataOld.nameOld !== data.nameProduct && dataOld.brandOld === data.brandProduct){ // ชื่อใหม่ และ แบรนด์เดิม
          fs.rename(pathNameOld, pathNameNew, (err) => {
            if (err) throw err;
          });
        const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
        fs.rename(pathImage, pathImageNew, (err) => {
          if (err) throw err;
        });
        fs.unlink(pathImageOld, (err) => {
          if (err) throw err;
        });
        if(update){
          const message = 'อัพเดทสินค้าเสร็จสิ้น'
            res.status(200).send(message)
          }else{
            const message = 'ไม่สามารถอัพเดทสินค้าได้'
            res.status(400).send(message)
          }
      }else{ // ชื่อใหม่ และ แบรนด์ใหม่
          if (!fs.existsSync(pathBrand)) {
            fs.mkdirSync(pathBrand);
            if(!fs.existsSync(pathProduct)){
              fs.mkdirSync(pathProduct)
              }
            }else {
              if(!fs.existsSync(pathProduct)){
                fs.mkdirSync(pathProduct);
                }
            }
            fs.rename(pathOld, pathImageNew, (err) => {
              if (err) throw err;
            });
            fs.unlink(pathImage, (err) => {
              if (err) throw err;
            });
            fs.rmSync(pathNameOld, { recursive: true }); // ลบโฟรเดอร์
            const update = await Product.findByIdAndUpdate(updateID,data,{useFindAndModify:false})
            if(update){
              const message = 'อัพเดทสินค้าเสร็จสิ้น'
                res.status(200).send(message)
              }else{
                const message = 'ไม่สามารถอัพเดทสินค้าได้'
                res.status(400).send(message)
              }
          }
    }catch(err){
    console.error(err)
    res.status(400).send("Error you cannot update product")
  }
})

router.get('/admin/product/delete/:id', async (req,res) => {
  try {
    const deleteID = req.params.id
    const queryID = await Product.findOne({_id:deleteID}).exec()
    if(queryID){
      const path = './public/image/product/' + queryID.brandProduct + '/' + queryID.nameProduct + '/' + queryID.imageProduct
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
        await Product.findByIdAndDelete(deleteID, {useFindAndModify: false});
        res.redirect('/admin/product');
    }
    
  } catch (err) {
    console.log(err);
    res.status(400).send("Error delete member");
  }
})

// Register
router.get('/register',(req,res)=>{
  const cart = req.session.cart || [];
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  res.render('register',{cartQuantity})
})

router.post('/register', async (req, res) => {
  try {
    const check = req.body.check_password
    const data = new Member({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      sex: req.body.sex,
      status: req.body.status
    })
    if(data.password === check){
        const regis = await saveData(data)
        if(regis){
          const message = 'สมัครสมาชิกเสร็จสิ้น' ;
          res.status(200).send(message);
        }else{
          const message = 'ไม่สามารถสมัครสมาชิกได้';
          res.status(400).send(message);
        }
    } else {
      const message = 'กรุณากรอกรหัสผ่านให้ตรงกัน';
      res.status(400).send(message);
    }
  } catch (err) {
    console.error(err)
    res.status(500).send("Error you cannot register")
  }
});

// Login
router.get('/login',(req,res)=>{
  const status =  req.session.status
  if(status === 'administrator'){
    res.redirect('/admin');
  }else{
    const cart = req.session.cart || [];
    const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    res.render('login',{cartQuantity})
  }
})

router.get('/logout',(req,res)=>{
  delete req.session.username;
  delete req.session.status;
  res.redirect('/');
})

router.post('/login', async (req, res) => {
  try {
    const username = req.body.username
    const password =  req.body.password
    const login_check =  req.body.login_check
    const timeExpire_confirm = 432000000 // 5วัน
    const timeExpire_not_confirm = 86400000 // 1วัน
    const user = await Member.findOne({ $or: [{username: username},{email: username}]}).exec()
    if(user){
      const pass = password === user.password
      if(pass){
        if(login_check === 'confirm'){
          req.session.status = user.status
          req.session.username = user.username
          req.session.cookie.maxAge = timeExpire_confirm
          const message = 'เข้าสู่ระบบสำเร็จ';
          res.status(200).send(message)
        }else{
          req.session.status = user.status
          req.session.username = user.username
          req.session.cookie.maxAge = timeExpire_not_confirm
          const message = 'เข้าสู่ระบบสำเร็จ';
          res.status(200).send(message)
        }
      }else{
        const message = 'กรุณาตรวจสอบความถูกต้อง'
        res.status(400).send(message)
      }
    }else{
      const message = 'กรุณาตรวจสอบความถูกต้อง'
      res.status(400).send(message)
    }
  } catch (err) {
    console.error(err)
    res.status(400).send("Error you cannot login")
  }
});

module.exports = router