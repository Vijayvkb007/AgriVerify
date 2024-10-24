let input = document.querySelector('input');
let button = document.querySelector('button');
let mainbutton = document.querySelector('#verify');

let qrcode = new QRCode(document.querySelector('#qrcode'), {
    width: 128,
    height: 128,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

button.addEventListener('click', () => {
    let inputValue = input.value;
    qrcode.clear();
    qrcode.makeCode(inputValue);
})

mainbutton.addEventListener('click', () => {
    let inputValue = {verification: true,
        name: "John Doe",
        email: "johndoe@gmail.com",
    };
    qrcode.clear();
    qrcode.makeCode(JSON.stringify(inputValue));
})