import MessagesModel from '../models/Messages.js';
import UserModel from '../models/User.js';
import moment from 'moment';

export const createMessenger = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const messenger = await MessagesModel.findOne({ owner: userId });

        if (!messenger) {
            const newMessenger = await MessagesModel.create({
                owner: userId,
            });
            return res.json(newMessenger);
        }
        return res.json(messenger);
    } catch (error) {
        console.error("Error creating messenger:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const createMessage = async (req, res) => {
    try {
        const {userId, message, adminId} = req.body;
        console.log('userId',userId);
        console.log('message',message);
        const date = moment().utcOffset(3).format('YYYY-MM-DD HH:mm:ss');

        const messenger = await MessagesModel.findOne({owner: userId});

        console.log('messenger',messenger);

        if(!messenger) {
            return res.json({message: 'user or messenger not found'})
        }

        if(adminId) {
            messenger.history.push({
                user: adminId,
                message,
                date
            })
        } else {
            messenger.history.push({
                user: userId,
                message,
                date
            })
        }

        await messenger.save();

        res.json(messenger);

    } catch(error) {

    }
}

export const getCurrentMesseges = async (req, res) => {
    try {
        const {id} = req.params;

        const messenger = await MessagesModel.findOne({owner: id}).populate('owner')

        if(!messenger) {
            return res.json({messege: 'messenger not found'})
        }

        res.json(messenger);

    } catch(error) {
        console.log(error);
    }
}