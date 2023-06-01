import { Schema, models, model } from "mongoose";

const AdminSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
    }
});


const Admin = models.Admin || model('Admin', AdminSchema)
export default Admin 