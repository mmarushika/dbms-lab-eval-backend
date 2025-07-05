import mongoose from 'mongoose';

export const Schema = mongoose.Schema

export const questionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    subType: { type: String, required: true },
    outputTypes: [ { type: String } ],
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
    ],

    solutionQuery: {type: String, required: true},
    solutionCallName: { type: String, required: true },
    validationQuery: { type: String }
});

export const testCaseSchema = new Schema({
    questionId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
    },
    input: {
        tables : [
            {
                tableName: { type: String },
                rows:[{type: Schema.Types.Mixed }],
                _id: false
            }
        ],
        variables: [
            {
                dir: { type: String },
                type: { type: String },
                name: { type: String },
                value: { type: Schema.Types.Mixed },
                _id: false
            }
        ],
        returnValue : {
            type: { type: String },
            _id: false
        },
        _id: false
    },
    output: {
        tables : [
            {
                tableName: { type: String },
                rows:[{type: Schema.Types.Mixed }],
                _id: false,
            }, 
        ],
        variables: [
            {
                dir: { type: String },
                type: { type: String },
                name: { type: String },
                value: { type: Schema.Types.Mixed },
                _id: false
            }
        ],
        dbms_output: [ { type: String } ],
        returnValue: {
            type: { type: String },
            value: { type: Schema.Types.Mixed },
            _id: false
        },
        _id: false
    },
    hidden: {type: Boolean, required: true},
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

export const userSchema = new Schema({
    oracleUsername: { type: String, required: true },
    oraclePassword: { type: String, required: true }
});

export const Question = mongoose.model('Question', questionSchema);
export const TestCase = mongoose.model('TestCase', testCaseSchema);
export const Submission = mongoose.model('Submission', submissionSchema);
export const User = mongoose.model('User', userSchema);