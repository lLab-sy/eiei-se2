import omise from '../config/omise';
import userRepository from '../repositories/userRepository';
import Transaction, { addCardRequestModel, chargeCustomerRequestModel, addCardResponseModel, chargeCustomerResponseModel, OmiseCard, ITransaction } from '../models/transactionModel';
import { IUser, IProducer } from '../models/userModel';
import transactionRepository from '../repositories/transactionRepository';

class paymentService {
    async addCardToCustomer(data: addCardRequestModel):Promise<addCardResponseModel|null>{
        const user: IUser | null = await userRepository.getUserByID(data.userId);
        if(!user) throw new Error('User not found');
        if(user.role !== 'producer') throw new Error('Only producers can add cards');
        if(!user.email) throw new Error('Email not found');
        
        let customerId = user.omiseCustomerId;
        
        if(!customerId) {
            try{
                const omiseCustomer = await omise.customers.create({email: user.email})
                customerId = omiseCustomer.id
    
                //may move to repo
                user.omiseCustomerId = customerId;
                await user.save();
            } catch (err) {
                console.error("Error in service layer:", err);
                throw new Error("Error in service layer: " + (err as Error).message);
            }
        }

        try{
            const updateCustomer = await omise.customers.update(customerId, {
                card: data.cardToken,
            })
            const newCard = await updateCustomer.cards.data.find(
                (card) => card.id === updateCustomer.default_card
            );

            if(!newCard) throw new Error('Card not found')

            //may move to repo
            if(user.role === 'producer'){
                const producer = user as IProducer
                if(!producer.cardIds) producer.cardIds = [];
                if (!producer.cardIds.includes(newCard.id)) {
                    producer.cardIds.push(newCard.id);
                }
                await producer.save();
            }

            const response: addCardResponseModel = {
                id: newCard.id,
                brand: newCard.brand,
                name: newCard.name,
                last_digits: newCard.last_digits,
                expiration_month: newCard.expiration_month,
                expiration_year: newCard.expiration_year,
                created: newCard.created,
              };
             
            return response;
        } catch (err){
            console.error("Error in service layer:", err);
            throw new Error("Error in service layer: " + (err as Error).message);
        }
    }

    async chargeCustomer (data: chargeCustomerRequestModel):Promise<chargeCustomerResponseModel>{
        const user = await userRepository.getUserByID(data.userId);
        if(!user) throw new Error('user not found');
        if(!user.omiseCustomerId) throw new Error('Omise customer ID not found');
        if(user.role !== 'producer'){
            throw new Error('Only producers can charges')
        }
            const producer = user as IProducer
    
            if (!producer.cardIds || !producer.cardIds.includes(data.cardId)) {
                throw new Error('You have no such card associated with your account.');
            }
            try{
                const charge = await omise.charges.create({
                    amount: data.amount * 100,
                    currency: 'thb',
                    customer: user.omiseCustomerId,
                    card: data.cardId,
                });
        
                //may move to repo
                if(charge.status === 'successful'){
                    const transaction = new Transaction({
                        userId: data.userId,
                        amount: charge.amount /100,
                        currency: charge.currency,
                        status: charge.status,
                        transactionId: charge.id,
                        transactionType: 'charge',
                    })
        
                    await transaction.save()
                }
                const response:chargeCustomerResponseModel = {
                    userId: data.userId,
                    amount: charge.amount /100,
                    currency: charge.currency,
                    status: charge.status,
                    transactionId: charge.id,
                    transactionType: 'charge',   
                }
                return response;
        
                
            } catch(err) {
                console.error("Error in service layer:", err);
                    throw new Error("Error in service layer: " + (err as Error).message);
            }                 
    }

    async getAllCards (userId: string):Promise<OmiseCard[]>{
        try {
            const user = await userRepository.getUserByID(userId);
        if(!user || !user.omiseCustomerId) throw new Error('Invalid user');

        const customer = await omise.customers.retrieve(user.omiseCustomerId);
        if(!customer) throw new Error('Invalid omise customer ID')

        const allCards = customer.cards.data

        return allCards
        } catch (err){
            console.error("Error in service layer:", err);
            throw new Error("Error in service layer: " + (err as Error).message);
        }
    }

    async getTransactions (userId: string):Promise<ITransaction[]>{
        try {
            const user = await userRepository.getUserByID(userId);
            if(!user || !user.omiseCustomerId) throw new Error('Invalid user');

            return await transactionRepository.getTransactions(userId);
        } catch (err){
            console.error("Error in service layer:", err);
            throw new Error("Error in service layer: " + (err as Error).message);
        }
    }
}

export default new paymentService();