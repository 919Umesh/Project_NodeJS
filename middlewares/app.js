
function testMiddleWare() {
    return (req, res, next) => {
        console.log('This is my middleware');
        next();  
    };
}

module.exports = { testMiddleWare }; 
