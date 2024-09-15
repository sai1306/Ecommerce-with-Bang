const pool = require('./../db');
const constant = require('./../Constant')
class SellerController {
    constructor(){}
    //Add Product Handler
    addProduct(data) {
        return new Promise(async (done, reject) => {
            const { name, category, description, price, discount, user } = data;
            if (user.role !== 'seller') {
                return reject('Unauthorized');
            }

            try {
                const newProduct = await pool.query(
                    'INSERT INTO products (name, category, description, price, discount, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [name, category, description, price, discount, user.id]
                );
                return done(newProduct.rows[0]);
            } catch (error) {
                return reject(constant.INVALID_INPUT);
            }
        })
    }

//Edit Product Handler
    editProduct(data) {
        return new Promise(async (done, reject)=>{
            const {name, category, description, price, discount, user, id} = data;
            if (user.role !== 'seller') {
              return reject('Unauthorized');
            }
            try {
              const updatedProduct = await pool.query(
                'UPDATE products SET name = $1, category = $2, description = $3, price = $4, discount = $5 WHERE id = $6 AND seller_id = $7 RETURNING *',
                [name, category, description, price, discount, id, user.id]
              );
          
              if (updatedProduct.rows.length === 0) {
                return reject('Product not found or you are not authorized to edit');
              }
              done(updatedProduct.rows[0]);
            } catch (error) {
              return reject(constant.INVALID_INPUT);
            }
        })

    }

//Delete Product Handler
    deleteProduct(data) {
        return new Promise(async (done , reject)=>{
            const{id, user} = data;
            if (user.role !== 'seller') {
              return reject('Unauthorized');
            }
          
            try {
              await pool.query('DELETE FROM products WHERE id = $1 AND seller_id = $2', [id, user.id]);
              return done('Product deleted');
            } catch (error) {
              return reject(constant.INVALID_INPUT);
            }
        })
        
    }
}

module.exports = SellerController;