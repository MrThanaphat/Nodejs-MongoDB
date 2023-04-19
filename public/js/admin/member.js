function insertMember() {
  let formData = {
    username: $("#username").val(),
    email: $("#email").val(),
    password: $("#password").val(),
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    sex: $("#sex").val(),
    status: $("#status").val()
  }
  $.ajax({
    url: "/admin/member/insert",
    type: "POST",
    data: formData,
    success: function(res) {
      if(res == "เพิ่มสมาชิกเสร็จสิ้น"){
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสมาชิกเสร็จสิ้น',
        confirmButtonColor: '#36AE7C',
        confirmButtonText: 'ยืนยัน',
        }).then(() => {
          window.location.href = '/admin';
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถเพิ่มสมาชิกได้',
          confirmButtonColor: '#EB5353',
          confirmButtonText: 'ยืนยัน',
        })
      }
    },
    error: function(err) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเพิ่มสมาชิกได้',
      confirmButtonColor: '#EB5353',
      confirmButtonText: 'ยืนยัน',
      })
    }
  });
}

function updateMember() {
  let formData = {
    id: $("#id").val(),
    username: $("#username").val(),
    email: $("#email").val(),
    password: $("#password").val(),
    first_name: $("#first_name").val(),
    last_name: $("#last_name").val(),
    sex: $("#sex").val(),
    status: $("#status").val()
  }
   $.ajax({
    type: "POST",
    url: "/admin/member/update",
    data: formData,
    success: function(res) {
      if(res == "อัพเดทข้อมูลเสร็จสิ้น"){
        Swal.fire({
          icon: 'success',
          title: 'อัพเดทข้อมูลเสร็จสิ้น',
          confirmButtonColor: '#36AE7C',
          confirmButtonText: 'ยืนยัน',
        }).then(() => {
          window.location.href = '/admin';
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถอัพเดทข้อมูลได้',
          confirmButtonColor: '#EB5353',
          confirmButtonText: 'ยืนยัน',
        })
      }
    },
    error: function(err) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเพิ่มสมาชิกได้',
      confirmButtonColor: '#EB5353',
      confirmButtonText: 'ยืนยัน',
      })
    }
  });
}

function deleteMember(id) {
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
        url: "/admin/member/delete/" + id,
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

