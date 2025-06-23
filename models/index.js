import mongoose from 'mongoose';

export const Schema = mongoose.Schema

export const questionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    marks : { type: Number, required: true },
    schemas: [
        {
            tableName: { type: String, required: true },
            rows: [
                {
                columnName: { type: String, required: true },
                columnType: { type: String, required: true }
                }
            ]
        }
    ]
});

export const testCaseSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    input: [
        {
            tableName: { type: String, required: true },
            rows:[{type: Schema.Types.Mixed, required: true}],
        }
    ],
    output: [{type: Schema.Types.Mixed, required: true}],
    hidden: {type: Boolean, required: true}
});

export const submissionSchema = new Schema({
    userId : { type: Schema.Types.ObjectId, ref: 'Question' },
    taskId: { type: Schema.Types.ObjectId, ref: 'Question' },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    timestamp:{ type: Date, default: Date.now },
    testCases: [
        {
            testCaseId: { type: Schema.Types.ObjectId, ref: 'TestCase' },
            passed: {type: Boolean, required: true},
            errorMsg: {type: String},
            output: [{type: Schema.Types.Mixed, required: true}]
        }
    ],
    passedCount: { type: Number, required: true },
    code: {type: String, required: true}
});

export const Question = mongoose.model('Question', questionSchema);
export const TestCase = mongoose.model('TestCase', testCaseSchema);
export const Submission = mongoose.model('Submission', submissionSchema);