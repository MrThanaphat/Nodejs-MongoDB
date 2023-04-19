// แสดงภาพของ header
let slideIndex = 0;
showDivs(slideIndex);
carousel();

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  let i;
  let x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}

function carousel() {
  let i;
  let x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > x.length) {slideIndex = 1}
  x[slideIndex-1].style.display = "block";
  setTimeout(carousel, 4000); // Change image every 2 seconds
}

function addCart(ProductID){
  $.ajax({
    url:"/addCarts/"+ ProductID,
    type:"GET",
    success:function(res){
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มสินค้าลงในตะกร้าเสร็จสิ้น',
          confirmButtonColor: '#36AE7C',
          confirmButtonText: 'ยืนยัน',
          html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
        }).then(() => {
          const { cart, totalQuantity } = res;
          const cartQuantity = document.querySelector('#cartQuantity');
          if (cartQuantity) {
            cartQuantity.textContent = totalQuantity;
          }
          });
    },
    error(err){
      Swal.fire({
        icon: 'error',
        title: 'มีจำนวนสินค้าคงเหลือไม่เพียงพอ',
        confirmButtonColor: '#EB5353',
        confirmButtonText: 'ยืนยัน',
        html: '<style>.swal2-title {font-family: "Kodchasan";}</style>',
      }).then(() => {
        const { cart, totalQuantity } = res;
        const cartQuantity = document.querySelector('#cartQuantity');
        if (cartQuantity) {
          cartQuantity.textContent = totalQuantity;
        }
        });
    }
  })
}