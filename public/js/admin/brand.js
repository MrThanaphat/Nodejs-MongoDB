function insertBrand(){
    let formData = {
        idBrand: $("#idBrand").val(),
        nameBrand: $("#nameBrand").val(),
    }
    $.ajax({
        url: "/admin/brand/insert",
        type: "POST",
        data:formData,
        success :function(res){
            if(res == 'เพิ่มแบร์นสินค้าเสร็จสิ้น'){
                Swal.fire({
                    icon: 'success',
                    title: 'เพิ่มแบร์นสินค้าเสร็จสิ้น',
                  confirmButtonColor: '#36AE7C',
                  confirmButtonText: 'ยืนยัน',
                  }).then(() => {
                    window.location.href = '/admin/brand';
                  });
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถเพิ่มแบร์นสินค้าได้',
                    confirmButtonColor: '#EB5353',
                    confirmButtonText: 'ยืนยัน',
                  })
                }
              },
              error: function(err) {
                Swal.fire({
                  icon: 'error',
                  title: 'ไม่สามารถเพิ่มแบร์นสินค้าได้',
                confirmButtonColor: '#EB5353',
                confirmButtonText: 'ยืนยัน',
                })
              }
    })
}

function updateBrand(){
  let formData = {
    id: $('#id').val(),
    idBrand: $('#idBrand').val(),
    nameBrand: $('#nameBrand').val()
  }
  $.ajax({
    url:"/admin/brand/update",
    type:"POST",
    data:formData,
    success: function(res){
      if(res == 'อัพเดทแบร์นสินค้าเสร็จสิ้น'){
        Swal.fire({
          icon: 'success',
          title: 'อัพเดทแบร์นสินค้าเสร็จสิ้น',
        confirmButtonColor: '#36AE7C',
        confirmButtonText: 'ยืนยัน',
        }).then(() => {
          window.location.href = '/admin/brand';
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถอัพเดทแบร์นสินค้าได้',
          confirmButtonColor: '#EB5353',
          confirmButtonText: 'ยืนยัน',
        })
      }
    },
    error: function(err) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถอัพเดทแบร์นสินค้าได้',
      confirmButtonColor: '#EB5353',
      confirmButtonText: 'ยืนยัน',
      })
    }
  })
}