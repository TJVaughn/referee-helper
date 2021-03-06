const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Event = require('./Event')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    fName: {
        type: String,
        trim: true
    },
    lName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Value must be a valid email address!")
            }
        }
    },
    password: {
        required: true,
        type: String,
        trim: true,
        validate(value){
            if(value.length < 8){
                throw new Error("Password must be greater than 7 characters!")
            } else if (value.toLowerCase().includes(['password', 'pass', '12345', '1234', '123', 'qwerty'])){
                throw new Error("Password can not contain certain common values")
                
            }
        }
    },  
    asEmail: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Value must be a valid email address!")
            }
        }
    },
    asPassword: {
        type: String,
        trim: true
    },
    asBestGroup: {
        type: String
    },
    hwrUsername: {
        type: String,
        trim: true,
    },
    hwrPassword: {
        type: String,
        trim: true
    },
    jobs: {
        asSyncStatus: {
            type: String
        },
        asBlockStatus: {
            type: String
        },
        asScheduleStatus: {
            type: String
        },
        asGroupStatus: {
            type: String
        },
        asVerifyBlockStatus: {
            type: String
        }
    },
    street: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    postalCode: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    hasCalledDistanceMatrixApi: {
        type: Number,
        default: 0
    },
    subscription: {
        type: Boolean
    },
    stripeData: {
        customer: {
            type: String
        },
        id: {
            type: String
        },
        startDate: {
            type: Number
        },
        endDate: {
            type: Number
        },
        billingCycleAnchor: {
            type: Number
        },
        status: {
            type: String
        },
        cancelAtPeriodEnd: {
            type: Boolean
        },
        plan: {
            id: {
                type: String
            },
            product: {
                type: String
            },
            nickname: {
                type: String
            },
            amount: {
                type: Number
            }
        }
    },
    groups: [
        {
            group: {
                name: {
                    type: String
                },
                number: {
                    type: String
                }
            }
        }
    ],
    level: {
        type: Number,
        default: 1,
        validate(value) {
            if(value < 1) {
                throw new Error('Level must be 1 or greater')
            }
        }  
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    },
}, {
    timestamps: true
})

userSchema.virtual('events', {
    ref: 'Event',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.tokens;
    delete userObject.password;
    delete userObject.avatar

    return userObject;
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })

    await user.save()
    return token
}

userSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 10)
    }

    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Event.deleteMany({ owner: user._id })
    next()
})

userSchema.statics.findByCredentials = async (email, pass) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error("Unable to login")
    }

    const isValidPass = await bcrypt.compare(pass, user.password)

    if(!isValidPass){
        throw new Error("Unable to login")
    }

    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User