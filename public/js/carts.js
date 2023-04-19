function destroyCart(){
    $.ajax({
        url:"/carts/destroy",
        type:"post",
        success:function(res){
            if(res == "ลบสินค้าในตะกร้า เรียบร้อยแล้ว"){
                Swal.fire({
                    icon: 'success',
                    title: 'ล้างตะกร้าสินค้า เรียบร้อยแล้ว',
                    confirmButtonColor: '#36AE7C',
                    confirmButtonText: 'ยืนยัน',
                    html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
                  }).then(() => {
                    window.location.href = '/carts';
                    });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถล้างตะกร้าสินค้าได้',
                    confirmButtonColor: '#EB5353',
                    confirmButtonText: 'ยืนยัน',
                    html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
                })
            }
        },
        error(err){
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถล้างตะกร้าสินค้าได้',
                confirmButtonColor: '#EB5353',
                confirmButtonText: 'ยืนยัน',
                html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
            })
        }
      })
}

function deleteItem(productID){
    $.ajax({
        url:"/carts/delete/" + productID,
        type:"POST",
        success:function(res){
            if(res == "ลบสินค้าชิ้นนี้"){
                Swal.fire({
                    icon: 'success',
                    title: 'ลบสินค้าชิ้นนี้ เรียบร้อยแล้ว',
                    confirmButtonColor: '#36AE7C',
                    confirmButtonText: 'ยืนยัน',
                    html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
                  }).then(() => {
                    window.location.href = '/carts';
                    });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถลบสินค้าชิ้นนี้ได้',
                    confirmButtonColor: '#EB5353',
                    confirmButtonText: 'ยืนยัน',
                    html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
                })
            }
        },
        error:function(err){
            Swal.fire({
                icon: 'error',
                title: 'ไม่สามารถลบสินค้าชิ้นนี้ได้',
                confirmButtonColor: '#EB5353',
                confirmButtonText: 'ยืนยัน',
                html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
            })
        }
    })
}

