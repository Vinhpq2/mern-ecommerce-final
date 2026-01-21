import Product from '../models/product.model.js';

export const getCartProducts = async (req, res) => {
	try {
		// Lấy danh sách ID sản phẩm từ giỏ hàng (item.product là ID tham chiếu)
		const products = await Product.find({ _id: { $in: req.user.cartItems.map(item => item.product) } });

		// Map dữ liệu: Duyệt qua cartItems của user để giữ đúng từng dòng (item) với size riêng biệt
		const finalCartItems = req.user.cartItems.map(cartItem => {
			const product = products.find(p => cartItem.product && p._id.toString() === cartItem.product.toString());
			if (!product) return null;
			return {
				...product.toJSON(),
				quantity: cartItem.quantity,
				size: cartItem.size // Trả về size để frontend hiển thị
			};
		}).filter(Boolean);

		res.json(finalCartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
export const addToCart = async(req, res) => {
    try{
    const  {productId, size}  = req.body;
    const user = req.user;

    // Kiểm tra sản phẩm trùng cả ID và Size
    const existingItem = user.cartItems.find((item) => item.product && item.product.toString() === productId && item.size === size);
    if(existingItem)
        existingItem.quantity += 1;
    else
        user.cartItems.push({ product: productId, quantity: 1, size: size });

    await user.save();
    res.json(user.cartItems);

    }
    catch(error) {
        console.log("Error in addToCart controller; ", error.message);
        res.status(500).json({message:"Server error", error: error.message});
    }
}

export const removeAllFromCart = async (req, res) =>{
    try{
        const { productId, size } = req.body;

        const user = req.user;
        if(!productId){
             user.cartItems = [];
        }else{
            // Xóa item khớp cả ID và Size
            user.cartItems = user.cartItems.filter(item => item.product && !(item.product.toString() === productId && item.size === size));
        }
    
    
        await user.save();
        res.json(user.cartItems);
    }
    catch(error) {
        console.log("Error in removeAllFromCart controller; ", error.message);
        res.status(500).json({message:"Server error", error: error.message});
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const {id:productId} = req.params;
        const {quantity, size} = req.body;
        const user = req.user;
        
        // Tìm item khớp cả ID và Size
        const existingItem = user.cartItems.find(item => item.product && item.product.toString() === productId && item.size === size);
        
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item => item.product && !(item.product.toString() === productId && item.size === size));
                await user.save();
                return res.json(user.cartItems);
            }
        

        existingItem.quantity = quantity;
        await user.save();
        res.json(user.cartItems);
        }
        else {
            return res.status(404).json({message:"Product not found in cart"});
        }
    } catch (error) {
        console.error("Error in updateQuantity controller; ", error.message);
        res.status(500).json({message:"Server error", error: error.message});
    }
}
export const removeUserCart = async (req, res) => {
        try {
            const user = req.user;
            user.cartItems = [];
            await user.save();
            res.json({ message: "User cart removed successfully" });
        } catch (error) {
            console.error("Error in removeUserCart controller; ", error.message);
            res.status(500).json({ message: "Server error", error: error.message });
        }
}
