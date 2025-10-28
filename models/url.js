import mongoose from 'mongoose'


const urlSchema = new mongoose.Schema({
  shortId:{
    type :String,
    required:true,
    unique:true,
  } ,
    redirectURL:{
        type:String,
        required:true,
        trim: true,
        validate: {
            validator: function(v) {
                try {
                    // Allow values without protocol; they will be normalized in pre-validate
                    const testValue = /^https?:\/\//i.test(v) ? v : `http://${v}`;
                    // eslint-disable-next-line no-new
                    new URL(testValue);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            message: 'redirectURL must be a valid URL'
        }
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    expiresAt: {
        type: Date,
        default: null,
        index: true
    },
    lastAccessed: {
        type: Date,
        default: null
    },
    visitHistory:[{timestamp:{ type:Number}}],
},
{
    timestamps : true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}

);

// Normalize redirectURL: ensure protocol exists; lower-case hostname
urlSchema.pre('validate', function(next) {
    if (this.redirectURL && typeof this.redirectURL === 'string') {
        try {
            const valueWithProtocol = /^https?:\/\//i.test(this.redirectURL)
                ? this.redirectURL
                : `http://${this.redirectURL}`;
            const urlObj = new URL(valueWithProtocol);
            // Normalize hostname to lowercase
            urlObj.hostname = urlObj.hostname.toLowerCase();
            this.redirectURL = urlObj.toString();
        } catch (e) {
            // leave as-is; validator will surface an error
        }
    }
    next();
});

// Virtual: number of clicks derived from visitHistory length
urlSchema.virtual('clicks').get(function() {
    return Array.isArray(this.visitHistory) ? this.visitHistory.length : 0;
});

// Virtual: whether the URL is currently expired
urlSchema.virtual('isExpired').get(function() {
    return !!(this.expiresAt && new Date() > this.expiresAt);
});

// Instance method to record a visit and update lastAccessed
urlSchema.methods.recordVisit = function(timestamp = Date.now()) {
    if (!Array.isArray(this.visitHistory)) this.visitHistory = [];
    this.visitHistory.push({ timestamp });
    this.lastAccessed = new Date(timestamp);
    return this.save();
};

// Static helper to fetch an active, non-expired URL by shortId
urlSchema.statics.findActiveByShortId = function(shortId) {
    return this.findOne({
        shortId,
        isActive: true,
        $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    });
};

// TTL index for automatic expiration when expiresAt is set
// MongoDB will delete documents when current time > expiresAt
// Only applies to documents where expiresAt is a valid Date
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: "date" } } });

// Performance index for shortId lookups
urlSchema.index({ shortId: 1 }, { unique: true });

const URL= mongoose.model("url",urlSchema);

export {URL}
