'use strict';

class NotesEntity{

    constructor(mongoose){
        var NotesSchema = mongoose.Schema(
            {
                note: {type: String, index: true},
                customerId: String,
                createdAt: { type: Date, default: Date.now }
            }
        );

        this.Model = mongoose.models.Note || mongoose.model('Note', NotesSchema);
    }
}
module.exports = NotesEntity;