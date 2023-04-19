$(document).ready(function () {
    $("#imageProduct").on('change',function(){  // แสดงรูปก่อนอัพโหลดไฟล์
      var $this = $(this);  
      const input = $this[0];  
      const fileName = $this.val().split("\\").pop();  
      $this.siblings(".custom-file-label").addClass("selected").html(fileName);  
      if (input.files && input.files[0]) {  
          var reader = new FileReader();  
          reader.onload = function (e) {  
              $('#preview').attr('src', e.target.result).fadeIn('slow');  
          }  
          reader.readAsDataURL(input.files[0]);  
      }
    });
  });

  function validateFile() { //เช็ครูปภาw
    const file = $("#imageProduct")[0].files[0];
    const validTypes = ["image/jpeg","image/jpg"]; // กำหนดชนิดไฟล์ที่ยอมรับ
    const maxSize = 5 * 1024 * 1024; // กำหนดขนาดไฟล์ไม่เกิน 5 MB
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'กรุณาเลือกรูปภาพ',
        confirmButtonColor: '#EB5353',
        confirmButtonText: 'ยืนยัน',
      })
      return false;
    }
  
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณาเลือกรูปภาพที่ขนาดไม่เกิน 5MB',
            confirmButtonColor: '#EB5353',
            confirmButtonText: 'ยืนยัน',
          })
      return false;
    }
  
    if (!validTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณาเลือกรูปภาพให้ถูกต้อง',
            text: 'นามสกุล.jpg หรือ .jpeg',
            confirmButtonColor: '#EB5353',
            confirmButtonText: 'ยืนยัน',
          })
      return false;
    }
  
    return true;
  }
  function insertProduct(){
    if($("#idProduct").val() === "" || //เช็คว่ามีข้อมูลกรอกมาไหม
            $("#brandProduct").val() === "" ||
            $("#nameProduct").val() === "" ||
            $("#sizeProduct").val() === "" ||
            $("#priceProduct").val() === "" ||
            $("#sex").val() === ""){
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                    confirmButtonColor: '#EB5353',
                    confirmButtonText: 'ยืนยัน',
                })
        }else{
          if (!validateFile()) {
              return;
          }else{  
                let formData = new FormData()
                formData.append("imageProduct", $("#imageProduct")[0].files[0]);
                formData.append("idProduct", $("#idProduct").val());
                formData.append("brandProduct", $("#brandProduct").val());
                formData.append("nameProduct", $("#nameProduct").val());
                formData.append("sizeProduct", $("#sizeProduct").val());
                formData.append("priceProduct", $("#priceProduct").val());
                formData.append("sex", $("#sex").val());
                $.ajax({
                    url: "/admin/product/insert",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success :function(res){
                        if(res == "เพิ่มสินค้าเสร็จสิ้น"){
                            Swal.fire({
                                icon: 'success',
                                title: 'เพิ่มสินค้าเสร็จสิ้น',
                                confirmButtonColor: '#36AE7C',
                                confirmButtonText: 'ยืนยัน',
                              }).then(() => {
                                window.location.href = '/admin/product';
                              });
                        }else{
                            Swal.fire({
                                icon: 'error',
                                title: 'ไม่เพิ่มสามารถสินค้าได้',
                                confirmButtonColor: '#EB5353',
                                confirmButtonText: 'ยืนยัน',
                            })
                        }
                    },
                    error : function(err){
                        Swal.fire({
                            icon: 'error',
                            title: 'ไม่เพิ่มสามารถสินค้าได้',
                            confirmButtonColor: '#EB5353',
                            confirmButtonText: 'ยืนยัน',
                        })
                    }
                })
              }
        }
  }

  function validateFileEdit() { //เช็ครูปภาw
    const file = $("#imageProduct")[0].files[0];
    const validTypes = ["image/jpeg","image/jpg"]; // กำหนดชนิดไฟล์ที่ยอมรับ
    const maxSize = 5 * 1024 * 1024; // กำหนดขนาดไฟล์ไม่เกิน 5 MB
    if (!file) {
      return false;
    }
  
    if (file.size > maxSize) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณาเลือกรูปภาพที่ขนาดไม่เกิน 5MB',
            confirmButtonColor: '#EB5353',
            confirmButtonText: 'ยืนยัน',
          })
      return false;
    }
  
    if (!validTypes.includes(file.type)) {
        Swal.fire({
            icon: 'error',
            title: 'กรุณาเลือกรูปภาพให้ถูกต้อง',
            text: 'นามสกุล.jpg หรือ .jpeg',
            confirmButtonColor: '#EB5353',
            confirmButtonText: 'ยืนยัน',
          })
      return false;
    }
  
    return true;
  }
function updateProduct(){
  if( $("#idProduct").val() === "" || //เช็คว่ามีข้อมูลกรอกมาไหม
      $("#brandProduct").val() === "" ||
      $("#nameProduct").val() === "" ||
      $("#sizeProduct").val() === "" ||
      $("#priceProduct").val() === "" ||
      $("#sex").val() === ""){
          Swal.fire({
              icon: 'error',
              title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
              confirmButtonColor: '#EB5353',
              confirmButtonText: 'ยืนยัน',
          })
    }else{
      if(!validateFileEdit()){
        let formData = {
          id:$("#id").val(),
          idProductOld:$("#idProductOld").val(),
          idProduct:$("#idProduct").val(),
          brandOld:$('#brandOld').val(),
          brandProduct:$("#brandProduct").val(),
          nameProduct:$("#nameProduct").val(),
          nameOld:$('#nameOld').val(),
          sizeProduct:$("#sizeProduct").val(),
          priceProduct:$("#priceProduct").val(),
          sex:$("#sex").val(),
          quantityProduct:$("#quantityProduct").val(),
          imageProduct:$("#OldPic").val(),
        }
        $.ajax({
          url: "/admin/product/updateOldPic/",
          type: "POST",
          data:formData,
          success: function(res) {
            if(res == 'อัพเดทสินค้าเสร็จสิ้น'){
              Swal.fire({
                icon: 'success',
                title: 'อัพเดทสินค้าเสร็จสิ้น',
              confirmButtonColor: '#36AE7C',
              confirmButtonText: 'ยืนยัน',
              }).then(() => {
                window.location.href = '/admin/product';
              });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถอัพเดทสินค้าได้',
                confirmButtonColor: '#EB5353',
                confirmButtonText: 'ยืนยัน',
              })
            }
          },error:function(err){
            Swal.fire({
              icon: 'error',
              title: 'ไม่สามารถอัพเดทสินค้าได้',
              confirmButtonColor: '#EB5353',
              confirmButtonText: 'ยืนยัน',
            })
          }
        })
      }else{
        let formData = new FormData()
          formData.append("id", $("#id").val());
          formData.append("imageProduct", $("#imageProduct")[0].files[0]);
          formData.append("OldPic", $("#OldPic").val());
          formData.append("idProductOld", $("#idProductOld").val());
          formData.append("idProduct", $("#idProduct").val());
          formData.append("brandProduct", $("#brandProduct").val());
          formData.append("brandOld", $("#brandOld").val());
          formData.append("nameOld", $("#nameOld").val());
          formData.append("nameProduct", $("#nameProduct").val());
          formData.append("sizeProduct", $("#sizeProduct").val());
          formData.append("priceProduct", $("#priceProduct").val());
          formData.append("quantityProduct", $("#quantityProduct").val());
          formData.append("sex", $("#sex").val());
        $.ajax({
            url: "/admin/product/updateNewPic",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success :function(res){
                if(res == "อัพเดทสินค้าเสร็จสิ้น"){
                    Swal.fire({
                        icon: 'success',
                        title: 'อัพเดทสินค้าเสร็จสิ้น',
                        confirmButtonColor: '#36AE7C',
                        confirmButtonText: 'ยืนยัน',
                      }).then(() => {
                        window.location.href = '/admin/product';
                      });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถอัพเดทสินค้าได้',
                        confirmButtonColor: '#EB5353',
                        confirmButtonText: 'ยืนยัน',
                    })
                }
            },
            error : function(err){
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถอัพเดทสินค้าได้',
                    confirmButtonColor: '#EB5353',
                    confirmButtonText: 'ยืนยัน',
                })
            }
        })
      }
    }
}

function deleteProduct(id){
  Swal.fire({
    title: 'คุณต้องการลบข้อมูลนี้?',
    text: "การกระทำนี้ไม่สามารถยกเลิกได้!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#36AE7C',
    cancelButtonColor: '#EB5353',
    confirmButtonText: 'ใช่, ฉันต้องการลบ!',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: "/admin/product/delete/" + id,
        success: function(response) {
          Swal.fire({
            icon: 'success',
            title: 'ลบแล้ว!',
            text:'ข้อมูลของคุณถูกลบแล้ว',
          confirmButtonColor: '#36AE7C',
          confirmButtonText: 'ยืนยัน',
          }).then(() => {
            location.reload();
          });
        }
      });
    }
  });
}