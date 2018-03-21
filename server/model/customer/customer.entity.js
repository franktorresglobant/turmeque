'use strict';

class CustomerEntity{

    constructor(mongoose){
        var CustomerSchema = mongoose.Schema(
            {
                name: {type: String, index: true},
                descr: String,
                website: String,
                address: String,
                phone: String,
                postalCode: String,
                status: String,
                createdAt: { type: Date, default: Date.now }
            }
        );
        CustomerSchema.index({ id: 'text' });

        this.Model = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
    }
}
module.exports = CustomerEntity;