console.log('This is NOT jQuery!');
window.jQuery = { message: '别相信我 (don\'t trust me)!' };
console.log('The fake jQuery is now loaded.')