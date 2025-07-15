import mongoose from 'mongoose';

export const Schema = mongoose.Schema

export const questionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['DDL', 'DML', 'PLSQL', 'CONSTRAINT'],
        required: true
    },
    subType: {
        type: String,
        enum: [
            'CREATE', 'ALTER', 'DROP', 'TRUNCATE', 'RENAME',
            'PROCEDURE', 'FUNCTION', 'TRIGGER', 'BLOCK',
            'INSERT', 'UPDATE', 'DELETE', 'SELECT',
            'NOT_NULL', 'UNIQUE', 'PRIMARY', 'FOREIGN', 'CHECK'],
        required: true
    },
    target: {
        type: String,
        enum: ['TABLE', 'VIEW'],
        required: function () {
            return this.type === 'DDL';
        }
    },
    outputTypes: {
        type: [{
            type: String,
            enum: ['dbms_output', 'returnValue', 'tables', 'variables'],
            required: true
        }],
        default: []
    },
    marks: { type: Number, required: true },
    schemas: [
        {
            tableName: { type: String, required: true },
            rows: {
                type: [{
                    columnName: { type: String, required: true },
                    columnType: { type: String, required: true },
                    _id: false
                }],
                default: []
            },
            _id: false
        }
    ],
    solutionQuery: { type: String, required: true },
    solutionCallName: { type: String },
    validationQuery: { type: String }
});

export const testCaseSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    input: {
        tables: [
            {
                tableName: { type: String },
                rows: [{ type: Schema.Types.Mixed }],
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
        returnValue: {
            type: { type: String },
            _id: false
        },
        _id: false
    },
    output: {
        tables: [
            {
                tableName: { type: String },
                rows: [{ type: Schema.Types.Mixed }],
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
        dbms_output: [{ type: String }],
        returnValue: {
            type: { type: String },
            value: { type: Schema.Types.Mixed },
            _id: false
        },
        _id: false
    },
    hidden: { type: Boolean, required: true },
});

export const submissionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    taskId: { type: String },/*{ type: Schema.Types.ObjectId, ref: 'Module' }*/
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    timestamp: { type: Date, default: Date.now },
    testCases: [
        {
            testCaseId: { type: Schema.Types.ObjectId, ref: 'TestCase' },
            passed: { type: Boolean, required: true },
            errorMsg: { type: String },
            output: {
                tables: [
                    {
                        tableName: { type: String },
                        rows: [{ type: Schema.Types.Mixed }],
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
                dbms_output: [{ type: String }],
                returnValue: {
                    type: { type: String },
                    value: { type: Schema.Types.Mixed },
                    _id: false
                },
                _id: false
            }
        }
    ],
    passedCount: { type: Number, required: true },
    code: { type: String, required: true }
});

export const moduleSchema = new Schema({
    moduleName: { type: String },
    createdAt: { type: Date, default: Date.now },

})

export const userSchema = new Schema({
    oracleUsername: { type: String, required: true },
    oraclePassword: { type: String, required: true }
});

export const Question = mongoose.model('Question', questionSchema);
export const TestCase = mongoose.model('TestCase', testCaseSchema);
export const Submission = mongoose.model('Submission', submissionSchema);
export const User = mongoose.model('User', userSchema);