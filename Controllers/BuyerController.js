const pool = require('./../db');
const constant = require('./../Constant')
class BuyerController {
    constructor() { }

    //Search Product Handler
    searchProduct(data) {
        return new Promise(async (done, reject) => {
            const { name, category } = data;
            const searchName = name || '';
            const searchCategory = category || '';
            try {
                const products = await pool.query(
                    'SELECT * FROM products WHERE name ILIKE $1 OR category ILIKE $2',
                    [`%${searchName}%`, `%${searchCategory}%`]
                );
                return done(products.rows);
            } catch (error) {
                console.error('Error fetching products:', error); // Log full error details
                return reject(constant.INVALID_INPUT);
              }
        })
    }

    //Add Cart Items Handler
    addCartItems(data) {
        return new Promise(async (done, reject)=>{
            const {productId, quantity, user} = data;
            if (user.role !== 'buyer') {
                return reject('Unauthorized');
              }
            
              try {
                const cartItem = await pool.query(
                  'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                  [user.id, productId, quantity]
                );
                return done(cartItem.rows[0]);
              } catch (error) {
                return reject(constant.INVALID_INPUT);
              }
        })
    }

    //Remove Cart Items Handler
    deleteCartItems(data){
        const { id, user } = data;
        return new Promise(async (done, reject)=>{
            try {
                await pool.query('DELETE FROM cart WHERE id = $1 AND user_id = $2', [id, user.id]);
                return done('Item removed from cart');
              } catch (error) {
                return reject(constant.INVALID_INPUT);
              }
        })
    }
}
module.exports = BuyerController;