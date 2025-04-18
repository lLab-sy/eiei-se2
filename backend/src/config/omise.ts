import omiseFactory from 'omise';

const omise = omiseFactory({
    secretKey: process.env.OMISE_SECRET_KEY || '',
    omiseVersion: '2023-10-01',
})

export default omise;