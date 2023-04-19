function register(){
  if( $("#username").val() === "" || //เช็คว่ามีข้อมูลกรอกมาไหม
      $("#email").val() === "" ||
      $("#password").val() === "" ||
      $("#check_password").val() === "" ||
      $("#first_name").val() === "" ||
      $("#last_name").val() === "" ||
      $("#sex").val() === "" ||
      $("#status").val() === ""){
          Swal.fire({
              icon: 'error',
              title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
              confirmButtonColor: '#EB5353',
              confirmButtonText: 'ยืนยัน',
              html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
          })
    }else{
      let formData = {
        username: $("#username").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        check_password: $("#check_password").val(),
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
        sex: $("#sex").val(),
        status: $("#status").val()
      }
      $.ajax({
        url:"/register",
        type:"POST",
        data:formData,
        success: function(res) {
          if(res == "สมัครสมาชิกเสร็จสิ้น"){
            Swal.fire({
              icon: 'success',
              title: 'สมัครสมาชิกเสร็จสิ้น',
              confirmButtonColor: '#36AE7C',
              confirmButtonText: 'ยืนยัน',
              html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
            }).then(() => {
              location.reload();
            });
          }else if(res == "กรุณากรอกรหัสผ่านให้ตรงกัน"){
            Swal.fire({
              icon: 'error',
              title: 'กรุณากรอกรหัสผ่านให้ตรงกัน',
              confirmButtonColor: '#EB5353',
              confirmButtonText: 'ยืนยัน',
              html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
            })
          }else{
            Swal.fire({
              icon: 'error',
              title: 'ไม่สามารถสมัครสมาชิกได้',
              confirmButtonColor: '#EB5353',
              confirmButtonText: 'ยืนยัน',
              html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
            }).then(() => {
              location.reload();
            });
          }
        },
        error: function(err) {
          if(err){
            Swal.fire({
              icon: 'error',
              title: 'ไม่สามารถสมัครสมาชิกได้',
            confirmButtonColor: '#EB5353',
            confirmButtonText: 'ยืนยัน',
            html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
            }).then(() => {
              location.reload();
            });
          }
        }
      })
    }
}