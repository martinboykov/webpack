import logo from '../public/images/logo.png';
import img1 from '../public/images/second_sec_img_1.png';
import img2 from '../public/images/second_sec_img_2.png';
import img3 from '../public/images/second_sec_img_3.png';


document.addEventListener('DOMContentLoaded', function(event) {
  const mobileToggleBtn = document.body.querySelector('.toggle-button');
  const nav = document.body.querySelector('.nav');
  mobileToggleBtn.addEventListener('click', function(ev) {
    mobileToggleBtn.classList.toggle('active');
    nav.classList.toggle('active');
  });

  const navLinks = document.body.querySelectorAll('.menu__item');
  navLinks.forEach((link) => {
    link.addEventListener('click', (ev) => {
      navLinks.forEach((li) => {
        if (li.classList.contains('active')) {
          li.classList.remove('active');
        }
      });
      link.classList.add('active');
    });
  });
});

