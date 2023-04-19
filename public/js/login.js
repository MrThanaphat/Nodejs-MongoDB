
function login(){
  const checkbox = document.getElementById('login_check');

    checkbox.addEventListener('change', function() {
        const loginCheckInput = document.getElementById('login_check');
        if (this.checked) {
            loginCheckInput.value = 'confirm';
        } else {
            loginCheckInput.value = 'not_confirm';
        }
    });
  let formData = {
      username: $("#username").val(),
      password: $("#password").val(),
      login_check: $("#login_check").val()
  }
 $.ajax({
    url:'/login',
    type:'POST',
    data: formData,
    success: function(res){
      if(res == "เข้าสู่ระบบสำเร็จ"){
        Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ',
          icon: 'success',
          confirmButtonColor: '#36AE7C',
          confirmButtonText: 'ยืนยัน',
          backdrop:'rgba(0,0,0,0.85)',
          html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
        }).then((res) => {
          if (res.isConfirmed) {
            window.location.href = '/admin';
          }
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'กรุณาตรวจสอบความถูกต้อง',
          confirmButtonText: 'ยืนยัน',
          confirmButtonColor: '#EB5353',
          backdrop:'rgba(0,0,0,0.85)',
          html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
        });
      }
    },error: function(err){
      if(err){
        Swal.fire({
          icon: 'error',
          title: 'กรุณาตรวจสอบความถูกต้อง',
          confirmButtonText: 'ยืนยัน',
          confirmButtonColor: '#EB5353',
          backdrop:'rgba(0,0,0,0.85)',
          html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
        });
      }
    }
  })
}