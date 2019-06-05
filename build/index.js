/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Modules/AUthentication/Controllers/AuthenticationController.js":
/*!************************************************************************!*\
  !*** ./Modules/AUthentication/Controllers/AuthenticationController.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst passport = __webpack_require__(/*! passport */ \"passport\")\r\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\")\r\nconst User = __webpack_require__(/*! Modules/User/Models/User */ \"./Modules/User/Models/User.js\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\")\r\nvar token\r\n\r\nclass AuthenticationController{\r\n\r\n    static register(req, res, next) {\r\n        try {\r\n            if (typeof req.body.password === 'undefined' || req.body.password == \"\")\r\n                return res.status(501).json({ error: \"password is required\" })\r\n            let user = new User()\r\n            user.title = req.body.title\r\n            user.user_type = (req.body.user_type) ? req.body.user_type : 'user'\r\n            user.first_name = (req.body.first_name) ? req.body.first_name : ''\r\n            user.last_name = req.body.last_name\r\n            user.email = req.body.email\r\n            user.password = User.hashPassword(req.body.password)\r\n            user.temporarytoken = crypto.randomBytes(20).toString('hex')\r\n             user.save(function (error) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    Activity.Email(user, 'New Registration', Activity.html('<p style=\"color: #000\">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at Brax Map.<br> Please click the link below to complete registration https://braxmap.com/#/activate/' + user.temporarytoken + '</p>'))\r\n                    Activity.activity_log(req, user._id, 'Registered')\r\n                    return res.status(201).json({ user: user, msg: 'Registration Successful, Please activate your account by visiting your mail.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static Activate(req, res, next) {\r\n        User.findOne({ temporarytoken: req.params.token }).then((user) => {\r\n            if (!user) {\r\n                res.json({ 'msg': 'token do not math' });\r\n            } else {\r\n                user.temporarytoken = null;\r\n                user.is_active = true;\r\n                Activity.Email(user, 'Account Activated', Activity.html('<p style=\"color: #000\">Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at Brax Map. Your Account has been activated successfully.'));\r\n                //getting mail data\r\n                 user.save();\r\n                return res.status(201).json(user);\r\n            }\r\n\r\n        }).catch((err)=>{\r\n            return res.status(401).json(err);\r\n        })\r\n    }\r\n\r\n    static login(req, res, next) {\r\n        passport.authenticate('local', { session: false }, function (err, user, info) {\r\n            if (err) { return res.status(404).json(err) }\r\n            if (!user) { return res.status(404).json(info) }\r\n            req.logIn(user, { session: false }, function (err) {\r\n                if (err) { return res.status(401).json({ error: error, msg: error.message }) }\r\n                if (user.temporarytoken == null || user.temporarytoken == \"false\") {\r\n                    token = jwt.sign({ id: user._id, email: user.email }, 'BraxMap', { expiresIn: '24h' })\r\n                    User.findOneAndUpdate({ email: user.email }, { $set: { temporarytoken: token } }, { upsert: true, returnNewDocument: true }).then(function (user) {\r\n                        if (user != null) next()\r\n                    })\r\n                    return res.status(201).json({ 'msg': 'Login Successful!', token: token, user: user })\r\n                }\r\n                return res.status(201).json({ 'msg': 'Login Successful!', token: user.temporarytoken, user: user })\r\n            })\r\n        })(req, res, next)\r\n    }\r\n\r\n    static logout(req, res, next) {\r\n        User.findOne({ temporarytoken: req.headers.authorization }).then((user) => {\r\n            if (user) {\r\n                user.temporarytoken = null;\r\n                 user.save();\r\n            }\r\n            return res.status(201).json({\r\n                'msg': 'Logout Successfull!',\r\n                token: null\r\n            });\r\n        }).catch((err) => {\r\n            return res.status(401).json({\r\n                'msg': 'Unable to logout'\r\n            });\r\n        })\r\n        \r\n    }\r\n}\r\n\r\nmodule.exports = AuthenticationController\n\n//# sourceURL=webpack:///./Modules/AUthentication/Controllers/AuthenticationController.js?");

/***/ }),

/***/ "./Modules/Authentication/Routes/index.js":
/*!************************************************!*\
  !*** ./Modules/Authentication/Routes/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst router = express.Router();\r\nconst Guard = __webpack_require__(/*! functions/auth */ \"./functions/auth.js\");\r\nconst AuthenticationController = __webpack_require__(/*! Modules/AUthentication/Controllers/AuthenticationController */ \"./Modules/AUthentication/Controllers/AuthenticationController.js\");\r\n\r\nrouter.post('/register', (req, res, next) => {\r\n    AuthenticationController.register(req, res, next);\r\n});\r\n\r\nrouter.patch('/activate/:token', (req, res, next) => {\r\n    AuthenticationController.Activate(req, res, next);\r\n});\r\n\r\nrouter.post('/login', (req, res, next) => {\r\n    AuthenticationController.login(req, res, next);\r\n});\r\n\r\nrouter.get(\"/logout\", [Guard.isValidUser], function (req, res, next) {\r\n    AuthenticationController.logout(req, res, next);\r\n});\r\n\r\nmodule.exports = router;\n\n//# sourceURL=webpack:///./Modules/Authentication/Routes/index.js?");

/***/ }),

/***/ "./Modules/BulkMessage/Controllers/BulkMessageController.js":
/*!******************************************************************!*\
  !*** ./Modules/BulkMessage/Controllers/BulkMessageController.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst BulkMessage = __webpack_require__(/*! Modules/BulkMessage/Models/BulkMessage */ \"./Modules/BulkMessage/Models/BulkMessage.js\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\n\r\nclass BulkMessageController {\r\n\r\n    static create(req, res, next) {\r\n        try {\r\n            if (!req.body.title) {\r\n                return res.status(422).json({ 'error': 'Please provide subject of the message' })\r\n            }\r\n            if (!req.body.message) {\r\n                return res.status(422).json({ 'error': 'Please provide message' })\r\n            }\r\n            if (!req.body.medium) {\r\n                return res.status(422).json({ 'error': 'Please provide medium' })\r\n            }\r\n            if (!req.body.receiver) {\r\n                return res.status(422).json({ 'error': 'Please provide user type' })\r\n            }\r\n            const message = new BulkMessage(req.body)\r\n            message.save(function(error) {\r\n                if (error) {\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else {\r\n                    if (req.body.medium == 'email' && req.body.type == 'immediate') {\r\n                        Activity.BulkEmail(message)\r\n                    } else {\r\n                        // Activity.BulkSms(message)\r\n                    }\r\n                    Activity.activity_log(req, req.body.user_id, ' Send Bulk  message')\r\n                    return res.status(201).json({ msg: 'bulk message successfully sent.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            BulkMessage.find({}, null, { sort: { 'createdAt': -1 } }).populate('user_id').then((messages) => {\r\n                return res.status(201).json({ messages: messages })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static update(req,res,next){\r\n        BulkMessage.findOneAndUpdate({ _id: req.params._id }, req.body, { upsert: true}, function (error) {\r\n            if (error) {\r\n                return res.status(401).json({ error: error, msg: error.message })\r\n            } else {\r\n                return res.status(201).json({ msg: 'Message Successfully updated.' })\r\n            }\r\n        })\r\n    }\r\n\r\n    static getMessage(req, res, next) {\r\n        BulkMessage.findOne({ id: req.params._id }).populate(\"user_id\").then(function (message) {\r\n            return res.status(201).json({ message: message })\r\n        }, function (error) {\r\n            return res.status(501).json({ \"success\": false, \"message\": error })\r\n        })\r\n    }\r\n}\r\n\r\nmodule.exports = BulkMessageController\n\n//# sourceURL=webpack:///./Modules/BulkMessage/Controllers/BulkMessageController.js?");

/***/ }),

/***/ "./Modules/BulkMessage/Models/BulkMessage.js":
/*!***************************************************!*\
  !*** ./Modules/BulkMessage/Models/BulkMessage.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst BulkMessageSchema = new Schema({\r\n    user_id: { type: Schema.ObjectId, ref: 'User' },\r\n    medium: { type: String,required: true },\r\n    receiver: { type: String, required: true },    \r\n    type: { type: String, required: true },\r\n    others: { type: String },\r\n    title: { type: String, required: true },\r\n    message: { type: String, required: true },\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('BulkMessage', BulkMessageSchema)\n\n//# sourceURL=webpack:///./Modules/BulkMessage/Models/BulkMessage.js?");

/***/ }),

/***/ "./Modules/BulkMessage/Routes/index.js":
/*!*********************************************!*\
  !*** ./Modules/BulkMessage/Routes/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\")\r\nconst router = express.Router()\r\nconst BulkMessageController = __webpack_require__(/*! Modules/BulkMessage/Controllers/BulkMessageController */ \"./Modules/BulkMessage/Controllers/BulkMessageController.js\")\r\n\r\nrouter.post('/message/create', (req, res, next) => {\r\n    BulkMessageController.create(req, res, next)\r\n})\r\n\r\nrouter.patch('/message/update/:id', (req, res, next) => {\r\n    BulkMessageController.update(req, res, next)\r\n})\r\n\r\nrouter.get('/message/all', (req, res, next) => {\r\n    BulkMessageController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/message/:id', (req, res, next) => {\r\n    BulkMessageController.getMessage(req, res, next)\r\n})\r\n\r\nmodule.exports = router\n\n//# sourceURL=webpack:///./Modules/BulkMessage/Routes/index.js?");

/***/ }),

/***/ "./Modules/Map/Controllers/CustomMapController.js":
/*!********************************************************!*\
  !*** ./Modules/Map/Controllers/CustomMapController.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\nconst CustomMap = __webpack_require__(/*! Modules/Map/Models/CustomMap */ \"./Modules/Map/Models/CustomMap.js\")\r\n\r\nclass CustomMapController { \r\n\r\n    static create(req, res, next) {\r\n        try {\r\n            if (!req.body.continent_id) {\r\n                return res.status(422).json({ 'error': 'Please provide continent for your map' })\r\n            }\r\n            if (!req.body.country_id) {\r\n                return res.status(422).json({ 'error': 'Please provide country' })\r\n            }\r\n            if (!req.body.full_name) {\r\n                return res.status(422).json({ 'error': 'Please provide name' })\r\n            }\r\n            if (!req.body.email) {\r\n                return res.status(422).json({ 'error': 'Please provide email' })\r\n            }\r\n\r\n            const map = new CustomMap()\r\n            map.continent_id = req.body.continent_id\r\n            map.country_id = req.body.country_id\r\n            map.full_name = req.body.full_name\r\n            map.description = req.body.description\r\n            map.email = req.body.email\r\n            map.save(function (error) {\r\n                if (error) {\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else { \r\n                    Activity.Email(map, 'New Request', Activity.html('<p style=\"color: #000\">Hello ' + map.full_name +', Thank you for using Brax Map.<br> \\r\\n Your map request has been received.</p>'))\r\n                    Activity.activity_log(req, req.body.user_id,' Added map')\r\n                    return res.status(201).json({ msg: 'Map Successfully created.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static update(req, res, next) {\r\n        try {\r\n            CustomMap.findById(req.params.id).then((map) => {\r\n                map.continent_id = (req.body.continent_id) ? req.body.continent_id : map.continent_id\r\n                map.country_id = (req.body.country_id) ? req.body.country_id : map.country_id\r\n                map.full_name = (req.body.full_name) ? req.body.full_name : map.full_name\r\n                map.description = req.body.description\r\n                map.email = (req.body.email) ? req.body.email : map.email\r\n                map.save(function (error) {\r\n                    if (error) {\r\n                        Activity.activity_log(req, req.user, 'Error Updating Map!')\r\n                        return res.status(501).json({ error: error, msg: error.message })\r\n                    } else {\r\n                        Activity.activity_log(req, req.user, 'Map Updated Successfully')\r\n                        return res.status(201).json({\r\n                            'map': map,\r\n                            'msg':' Map Updated Successfully!'\r\n                        })\r\n                    }\r\n                })\r\n            }).catch((err) =>{\r\n                return res.status(401).json({ error: err, msg: err.message })\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            CustomMap.find({}, null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((maps) => {\r\n                return res.status(201).json({ maps: maps })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getAllByContinent(req, res, next) {\r\n        try {\r\n            CustomMap.find({ continent_id : req.params.continent_id}, null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((maps) => {\r\n                return res.status(201).json({ maps: maps })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getAllByCountry(req, res, next) {\r\n        try {\r\n            CustomMap.find({ country_id: req.params.country_id }, null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((maps) => {\r\n                return res.status(201).json({ maps: maps })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getOne(req, res, next) {\r\n        try {\r\n            CustomMap.findById(req.params.id , null, { sort: { 'createdAt': -1 } }).populate('continent_id').populate('country_id').then((map) => {\r\n                return res.status(201).json({ map: map })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static delete(req, res, next) {\r\n        try {\r\n            CustomMap.findByIdAndDelete( req.params.id, function (error, map) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    return res.json({ map: map, msg:\"map was deleted successfully\" })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n}\r\n\r\nmodule.exports = CustomMapController\n\n//# sourceURL=webpack:///./Modules/Map/Controllers/CustomMapController.js?");

/***/ }),

/***/ "./Modules/Map/Controllers/MapController.js":
/*!**************************************************!*\
  !*** ./Modules/Map/Controllers/MapController.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\nconst Maps = __webpack_require__(/*! Modules/Map/Models/Map */ \"./Modules/Map/Models/Map.js\")\r\nconst File = __webpack_require__(/*! functions/file */ \"./functions/file.js\")\r\n\r\nclass MapController { \r\n\r\n    static create(req, res, next) {\r\n        try {\r\n            if (!req.body.continent_id) {\r\n                return res.status(422).json({ 'error': 'Please provide continent for your map' })\r\n            }\r\n            if (!req.body.country_id) {\r\n                return res.status(422).json({ 'error': 'Please provide country' })\r\n            }\r\n            if (!req.body.name) {\r\n                return res.status(422).json({ 'error': 'Please provide name' })\r\n            }\r\n\r\n            const map = new Maps()\r\n            map.user_id = req.body.user_id\r\n            map.continent_id = req.body.continent_id\r\n            map.country_id = req.body.country_id\r\n            map.name = req.body.name\r\n            map.description = req.body.description\r\n            map.image = (req.body.image) ? File.Image(req.body.image,\"/images/profile/\", req.body.name,'.png') : ''\r\n            map.html_file = (req.body.html_file) ? File.generalFile(req.body.html_file,\"/files/html/\", req.body.name,'.html') : ''\r\n            map.js_file = (req.body.js_file) ? File.generalFile(req.body.js_file, \"/files/js/\",req.body.name,'.js') : ''\r\n            map.zip_file = (req.body.zip_file) ? File.zipFile(req.body.zip_file,\"/files/zip/\", req.body.name,'') : ''\r\n            map.save(function (error) {\r\n                if (error) {\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else { \r\n                    Activity.activity_log(req, req.body.user_id,' Added map')\r\n                    return res.status(201).json({ msg: 'Map Successfully created.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static update(req, res, next) {\r\n        try {\r\n            Maps.findById(req.params.id).populate('user_id').then((map) => {                \r\n                    map.user_id = req.body.user_id\r\n                    map.continent_id = (req.body.continent_id) ? req.body.continent_id : map.continent_id\r\n                    map.country_id = (req.body.country_id) ? req.body.country_id : map.country_id\r\n                    map.name = (req.body.name) ? req.body.name : map.name\r\n                    map.description = req.body.description\r\n                    map.image = (req.body.image) ? File.Image(req.body.image,\"/images/profile/\", req.body.name,'.png') : map.image\r\n                    map.html_file = (req.body.html_file) ? File.generalFile(req.body.html_file,\"/files/html/\", req.body.name,'.html') : map.html_file\r\n                    map.js_file = (req.body.js_file) ? File.generalFile(req.body.js_file, \"/files/js/\",req.body.name,'.js') : map.js_file\r\n                    map.zip_file = (req.body.zip_file) ? File.zipFile(req.body.zip_file,\"/files/zip/\", req.body.name,'') : map.zip_file\r\n                    map.save(function (error) {\r\n                        if (error) {\r\n                            Activity.activity_log(req, req.user, 'Error Updating Map!')\r\n                            return res.status(501).json({ error: error, msg: error.message })\r\n                        } else {\r\n                            Activity.activity_log(req, req.user, 'Map Updated Successfully')\r\n                            return res.status(201).json({\r\n                                'map': map,\r\n                                'msg':' Map Updated Successfully!'\r\n                            })\r\n                        }\r\n                    })\r\n                }).catch((err) =>{\r\n                    return res.status(401).json({ error: err, msg: err.message })\r\n                })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            Maps.find({}, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {\r\n                return res.status(201).json({ maps: maps })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getAllByContinent(req, res, next) {\r\n        try {\r\n            Maps.find({ continent_id : req.params.continent_id}, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {\r\n                return res.status(201).json({ maps: maps })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getAllByCountry(req, res, next) {\r\n        try {\r\n            Maps.find({ country_id: req.params.country_id }, null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((maps) => {\r\n                return res.status(201).json({ maps: maps })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getOne(req, res, next) {\r\n        try {\r\n            Maps.findById(req.params.id , null, { sort: { 'createdAt': -1 } }).populate('user_id').populate('continent_id').populate('country_id').then((map) => {\r\n                return res.status(201).json({ map: map })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static delete(req, res, next) {\r\n        try {\r\n            Maps.findByIdAndDelete( req.params.id, function (error, user) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    return res.json({ user: user, msg: user.first_name + \" was deleted successfully\" })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n}\r\n\r\nmodule.exports = MapController\n\n//# sourceURL=webpack:///./Modules/Map/Controllers/MapController.js?");

/***/ }),

/***/ "./Modules/Map/Models/CustomMap.js":
/*!*****************************************!*\
  !*** ./Modules/Map/Models/CustomMap.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\")\r\n\r\nconst CustomMapSchema = new Schema({\r\n    continent_id: { type: Schema.ObjectId, ref: 'Continent' },\r\n    country_id: { type: Schema.ObjectId, ref: 'Country' },\r\n    full_name: { type: String, required: true },\r\n    description: { type: String },\r\n    email: {\r\n        type: String,\r\n        lowercase: true,\r\n        required: true,\r\n        validate: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please fill a valid email address'],\r\n        match: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please fill a valid email address']\r\n    },\r\n}, { timestamps: true })\r\n\r\nCustomMapSchema.plugin(uniqueValidator)\r\nmodule.exports = mongoose.model('CustomMap', CustomMapSchema)\n\n//# sourceURL=webpack:///./Modules/Map/Models/CustomMap.js?");

/***/ }),

/***/ "./Modules/Map/Models/Map.js":
/*!***********************************!*\
  !*** ./Modules/Map/Models/Map.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\")\r\n\r\nconst MapSchema = new Schema({\r\n    user_id: { type: Schema.ObjectId, ref: 'User' },\r\n    continent_id: { type: Schema.ObjectId, ref: 'Continent' },\r\n    country_id: { type: Schema.ObjectId, ref: 'Country' },\r\n    name: { type: String, required: true, index: { unique: true, dropDups: true }},\r\n    description: { type: String },\r\n    image:{type: String},\r\n    html_file: { type: String, default : null },\r\n    js_file: { type: String, default : null},\r\n    zip_file: { type: String,default : null },\r\n}, { timestamps: true })\r\n\r\nMapSchema.plugin(uniqueValidator)\r\nmodule.exports = mongoose.model('Map', MapSchema)\n\n//# sourceURL=webpack:///./Modules/Map/Models/Map.js?");

/***/ }),

/***/ "./Modules/Map/Routes/index.js":
/*!*************************************!*\
  !*** ./Modules/Map/Routes/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\")\r\nconst router = express.Router()\r\nconst Guard = __webpack_require__(/*! functions/auth */ \"./functions/auth.js\")\r\nconst MapController = __webpack_require__(/*! Modules/Map/Controllers/MapController */ \"./Modules/Map/Controllers/MapController.js\")\r\nconst CustomMapController = __webpack_require__(/*! Modules/Map/Controllers/CustomMapController */ \"./Modules/Map/Controllers/CustomMapController.js\")\r\n\r\nrouter.post('/map/create', [Guard.isValidUser], (req,res,next) =>{\r\n    MapController.create(req,res,next)\r\n})\r\n\r\nrouter.patch('/map/update/:id', [Guard.isValidUser], (req, res, next) => {\r\n    MapController.update(req, res, next)\r\n})\r\n\r\nrouter.get('/maps', [Guard.isValidUser], (req, res, next) => {\r\n    MapController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/maps/country/:country_id', [Guard.isValidUser], (req, res, next) => {\r\n    MapController.getAllByCountry(req, res, next)\r\n})\r\n\r\nrouter.get('/maps/continent/:continent_id', [Guard.isValidUser], (req, res, next) => {\r\n    MapController.getAllByContinent(req, res, next)\r\n})\r\n\r\nrouter.get('/map/:id', [Guard.isValidUser], (req, res, next) => {\r\n    MapController.getOne(req, res, next)\r\n})\r\n\r\nrouter.delete('/map/:id', [Guard.isValidUser], (req, res, next) => {\r\n    MapController.delete(req, res, next)\r\n})\r\n\r\n\r\nrouter.post('/custom_map/create', [Guard.isValidUser], (req,res,next) =>{\r\n    CustomMapController.create(req,res,next)\r\n})\r\n\r\nrouter.patch('/custom_map/update/:id', [Guard.isValidUser], (req, res, next) => {\r\n    CustomMapController.update(req, res, next)\r\n})\r\n\r\nrouter.get('/custom_maps', [Guard.isValidUser], (req, res, next) => {\r\n    CustomMapController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/custom_maps/country/:country_id', [Guard.isValidUser], (req, res, next) => {\r\n    CustomMapController.getAllByCountry(req, res, next)\r\n})\r\n\r\nrouter.get('/custom_maps/continent/:continent_id', [Guard.isValidUser], (req, res, next) => {\r\n    CustomMapController.getAllByContinent(req, res, next)\r\n})\r\n\r\nrouter.get('/custom_map/:id', [Guard.isValidUser], (req, res, next) => {\r\n    CustomMapController.getOne(req, res, next)\r\n})\r\n\r\nrouter.delete('/custom_map/:id', [Guard.isValidUser], (req, res, next) => {\r\n    CustomMapController.delete(req, res, next)\r\n})\r\n\r\nmodule.exports = router\n\n//# sourceURL=webpack:///./Modules/Map/Routes/index.js?");

/***/ }),

/***/ "./Modules/Site/Controllers/ActivityController.js":
/*!********************************************************!*\
  !*** ./Modules/Site/Controllers/ActivityController.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Activity = __webpack_require__(/*! Modules/Site/Models/ActivityLog */ \"./Modules/Site/Models/ActivityLog.js\")\r\n\r\nclass activitytController {\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            Activity.find({ deleted_at: null }).sort('-createdAt').populate(\"user_id\").then((activities) => {\r\n                return res.status(201).json({ activities: activities })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getuserAll(req, res, next) {\r\n        try {\r\n            Activity.find({ user_id: req.params.user_id }).sort('-createdAt').populate(\"user_id\").then((activities) => {\r\n                return res.status(201).json({ activities: activities })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getuserLastFive(req, res, next) {\r\n        try {\r\n            Activity.find({ user_id: req.params.user_id }).sort('-createdAt').limit(5).then((activities) => {\r\n                return res.status(201).json({ activities: activities })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n}\r\nmodule.exports = activitytController\n\n//# sourceURL=webpack:///./Modules/Site/Controllers/ActivityController.js?");

/***/ }),

/***/ "./Modules/Site/Controllers/ContactController.js":
/*!*******************************************************!*\
  !*** ./Modules/Site/Controllers/ContactController.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Contact = __webpack_require__(/*! Modules/Site/Models/Contact */ \"./Modules/Site/Models/Contact.js\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\n\r\nclass ContactController {\r\n\r\n    static create(req, res,next) {\r\n        try {\r\n            if (!req.body.full_name) {\r\n                return res.status(422).json({ 'error': 'Please provide full name' })\r\n            }\r\n            if (!req.body.email) {\r\n                return res.status(422).json({ 'error': 'Please provide email' })\r\n            }\r\n            if (!req.body.phone) {\r\n                return res.status(422).json({ 'error': 'Please provide phone number' })\r\n            }\r\n            if (!req.body.message) {\r\n                return res.status(422).json({ 'error': 'Please provide message' })\r\n            }\r\n            const contact = new Contact(req.body)\r\n            contact.save(function(error) {\r\n                if (error) {\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else {\r\n                    Activity.Email('', 'New Contact Message',  Activity.html('<p style=\"color: #000\">Hello Administrator,' + contact.message + '<br> from ' + contact.email + ' with the phone number ' + contact.phone + '.</p>'))\r\n                    Activity.Email(contact, 'New Contact Message Recieve',  Activity.html('<p style=\"color: #000\">Hello ' + contact.full_name + \", <br> Your message has been recieved, we will get back to you shortly.</p>\"))\r\n                    Activity.activity_log(req, null, contact.full_name + ' Sent Administrator a message')\r\n                    return res.status(201).json({ msg: 'Contact message Successfully received.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            Contact.find({}, null, { sort: { 'createdAt': -1 } }).then((contacts) => {\r\n                return res.status(201).json({ contacts: contacts })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n}\r\nmodule.exports = ContactController\n\n//# sourceURL=webpack:///./Modules/Site/Controllers/ContactController.js?");

/***/ }),

/***/ "./Modules/Site/Controllers/ContinentController.js":
/*!*********************************************************!*\
  !*** ./Modules/Site/Controllers/ContinentController.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Continent = __webpack_require__(/*! Modules/Site/Models/Continent */ \"./Modules/Site/Models/Continent.js\")\r\nconst Country = __webpack_require__(/*! Modules/Site/Models/Country */ \"./Modules/Site/Models/Country.js\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\n\r\nclass ContinentController{\r\n\r\n    static create(req, res,next) {\r\n        try {\r\n            if (!req.body.name) {\r\n                return res.status(422).json({ 'error': 'Please provide continent name' })\r\n            }\r\n            if (!req.body.description) {\r\n                return res.status(422).json({ 'error': 'Please provide description' })\r\n            }\r\n            if (!req.body.longtitude) {\r\n                return res.status(422).json({ 'error': 'Please provide longtitude' })\r\n            }\r\n            if (!req.body.latitude) {\r\n                return res.status(422).json({ 'error': 'Please provide latitude' })\r\n            }\r\n            const continent = new Continent(req.body)\r\n            continent.save(function(error) {\r\n                if (error) {\r\n                    Activity.activity_log(req, req.user, 'Error Creating Continent!')\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else {\r\n                    Activity.activity_log(req, null, req.user + ' Added Continent')\r\n                    return res.status(201).json({ msg: 'Continent Successfully received.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static update(req, res, next) {\r\n        try {\r\n            Continent.findById(req.params.id, function (error, continent) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    continent.name = (req.body.name) ? req.body.name : continent.name\r\n                    continent.latitude = (req.body.latitude) ? req.body.latitude : continent.latitude\r\n                    continent.longtitude = (req.body.longtitude) ? req.body.longtitude : continent.longtitude\r\n                    continent.description = (req.body.description) ? req.body.description : continent.description\r\n                    continent.save(function (error) {\r\n                        if (error) {\r\n                            Activity.activity_log(req, req.user, 'Error Updating Continent!')\r\n                            return res.status(501).json({ error: error, msg: error.message })\r\n                        } else {\r\n                            Activity.activity_log(req, req.user, 'Continent Updated Successfully')\r\n                            return res.status(201).json({\r\n                                'continent': continent,\r\n                                'msg': continent.name +\r\n                                    ' Continent Updated Successfully!'\r\n                            })\r\n                        }\r\n                    })\r\n                }\r\n\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n    static getAllCountry(req, res, next) {\r\n        try {\r\n            Country.find({ continent_id: req.params.continent_id }, null, { sort: { 'createdAt': -1 } }).populate('continent_id').then((countries) => {\r\n                return res.status(201).json({ countries: countries })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            Continent.find({}, null, { sort: { 'createdAt': -1 } }).then((continents) => {\r\n                return res.status(201).json({ continents: continents })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getOne(req, res, next) {\r\n        try {\r\n            Continent.findById(req.params.id).then((continents) => {\r\n                return res.status(201).json({ continents: continents })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n}\r\n\r\nmodule.exports = ContinentController\n\n//# sourceURL=webpack:///./Modules/Site/Controllers/ContinentController.js?");

/***/ }),

/***/ "./Modules/Site/Controllers/CountryController.js":
/*!*******************************************************!*\
  !*** ./Modules/Site/Controllers/CountryController.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nconst Country = __webpack_require__(/*! Modules/Site/Models/Country */ \"./Modules/Site/Models/Country.js\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\n\r\nclass CountryController {\r\n\r\n    static create(req, res,next) {\r\n        try {\r\n            if (!req.body.name) {\r\n                return res.status(422).json({ 'error': 'Please provide country name' })\r\n            }\r\n            if (!req.body.continent_id) {\r\n                return res.status(422).json({ 'error': 'Please provide continent_id' })\r\n            }\r\n            if (!req.body.description) {\r\n                return res.status(422).json({ 'error': 'Please provide description' })\r\n            }\r\n            if (!req.body.longtitude) {\r\n                return res.status(422).json({ 'error': 'Please provide longtitude' })\r\n            }\r\n            if (!req.body.latitude) {\r\n                return res.status(422).json({ 'error': 'Please provide latitude' })\r\n            }\r\n            const country = new Country(req.body)\r\n            country.save(function(error) {\r\n                if (error) {\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else {\r\n                    Activity.activity_log(req, null, req.user + ' Added country')\r\n                    return res.status(201).json({ msg: 'country Successfully received.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static update(req, res, next) {\r\n        try {\r\n            Country.findById(req.params.id, function (error, country) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    country.name = (req.body.name) ? req.body.name : continent.name\r\n                    country.continent_id = (req.body.continent_id) ? req.body.continent_id : continent.continent_id\r\n                    country.latitude = (req.body.latitude) ? req.body.latitude : country.latitude\r\n                    country.longtitude = (req.body.longtitude) ? req.body.longtitude : country.longtitude\r\n                    country.description = (req.body.description) ? req.body.description : country.description\r\n                    country.save(function (error) {\r\n                        if (error) {\r\n                            Activity.activity_log(req, req.user, 'Error Updating country!')\r\n                            return res.status(501).json({ error: error, msg: error.message })\r\n                        } else {\r\n                            Activity.activity_log(req, req.user, 'country Updated Successfully')\r\n                            return res.status(201).json({\r\n                                'country': country,\r\n                                'msg': country.name +\r\n                                    ' country Updated Successfully!'\r\n                            })\r\n                        }\r\n                    })\r\n                }\r\n\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n    static getAll(req, res, next) {\r\n        try {\r\n            Country.find({}, null, { sort: { 'createdAt': -1 } }).populate('continent_id').then((countries) => {\r\n                return res.status(201).json({ countries: countries })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getOne(req, res, next) {\r\n        try {\r\n            Country.findById(req.params.id).populate('continent_id').then((country) => {\r\n                return res.status(201).json({ country: country })\r\n            }).catch((error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n}\r\n\r\nmodule.exports = CountryController\n\n//# sourceURL=webpack:///./Modules/Site/Controllers/CountryController.js?");

/***/ }),

/***/ "./Modules/Site/Controllers/ExtraController.js":
/*!*****************************************************!*\
  !*** ./Modules/Site/Controllers/ExtraController.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Support = __webpack_require__(/*! Modules/Support/Models/Support */ \"./Modules/Support/Models/Support.js\")\r\nconst EmailAlert = __webpack_require__(/*! Modules/Site/Models/Email */ \"./Modules/Site/Models/Email.js\")\r\nconst User = __webpack_require__(/*! Modules/User/Models/User */ \"./Modules/User/Models/User.js\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\nconst result = {}\r\n\r\nclass ExtraController {\r\n\r\n    static countUserDoc(req, res, next) {\r\n        Support.find({ user_id: req.params.user_id }).countDocuments().then(count => {\r\n            result.support_count = count\r\n        }).catch(error => {\r\n            return res.status(422).json(error)\r\n        })\r\n    }\r\n\r\n    static countAllDoc(req, res, next) {\r\n        Support.find({}).countDocuments().then(count => {\r\n            result.support_count = count\r\n        }).catch(error => {\r\n            return res.status(422).json(error)\r\n\r\n        })\r\n    }\r\n\r\n    static deactivateAlertEmail(req, res, next) {\r\n        EmailAlert.findOne({ email: req.params.email }).then(function (email) {\r\n            email.status = 0\r\n            email.save()\r\n            return res.status(201).json({ msg: 'you have unsubscribed from latest deals alert.' })\r\n        }, function (error) {\r\n            return res.status(501).json({ \"success\": false, \"message\": error })\r\n        })\r\n    }\r\n\r\n    static emailAlert(req,res,next){\r\n        EmailAlert.findOne({ email: req.body.email }).then(function (email) {\r\n            if(email != null && email.email === req.body.email)\r\n                return res.status(201).json({ msg: 'you are a subscribed member, thanks you!' })\r\n            else\r\n                Activity.alertEmail(req)\r\n                Activity.Email(req.body, 'Brax Alert', Activity.html('<p style=\"color: #000\">Hello ' + req.body.email + '<br>, Thank you for creating a price alert at Brax Map.we will update you with our latest and cheapest deals.<br><br><br><br><br>click <a href=\"https://braxmap.com/unsubscribe/\"' + req.body.email + '>here</a> to unsubscribe</p>'))\r\n                return res.status(201).json({ msg: 'Email Alert Successfully Activated.' })\r\n        }, function (error) {\r\n            return res.status(501).json({ \"success\": false, \"message\": error })\r\n        })\r\n        \r\n    }\r\n}\r\nmodule.exports = ExtraController\n\n//# sourceURL=webpack:///./Modules/Site/Controllers/ExtraController.js?");

/***/ }),

/***/ "./Modules/Site/Controllers/MailSettingsController.js":
/*!************************************************************!*\
  !*** ./Modules/Site/Controllers/MailSettingsController.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst MailSettings = __webpack_require__(/*! Modules/Site/Models/MailSettings */ \"./Modules/Site/Models/MailSettings.js\")\r\n\r\nclass MailSettingsController {\r\n\r\n    static create(req, res, next) {\r\n        try {\r\n            let setting ={\r\n                data: req.body\r\n            }\r\n            if(req.body._id !== \"\"){\r\n                MailSettings.findOneAndUpdate({_id: req.body._id }, setting ,{upsert: true, new: false},function(error) {\r\n                    if (error) {\r\n                        return res.status(401).json({ error: error, msg: error.message })\r\n                    } else {\r\n                        return res.status(201).json({ msg: 'Mail Settings Successfully updated.' })\r\n                    }\r\n                })\r\n\r\n            }else{\r\n\r\n                let settings = new MailSettings(setting)\r\n                settings.save(function(error) {\r\n                    if (error) {\r\n                        return res.status(401).json({ error: error, msg: error.message })\r\n                    } else {\r\n                        return res.status(201).json({ msg: 'Mail Settings Successfully saved.' })\r\n                    }\r\n                })\r\n\r\n            }\r\n        } catch (error) {\r\n            \r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            MailSettings.findOne({}, null, { sort: { 'createdAt': -1 } }).then((settings) => {\r\n                return res.status(201).json({ settings: settings })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n}\r\nmodule.exports = MailSettingsController\n\n//# sourceURL=webpack:///./Modules/Site/Controllers/MailSettingsController.js?");

/***/ }),

/***/ "./Modules/Site/Controllers/SettingsController.js":
/*!********************************************************!*\
  !*** ./Modules/Site/Controllers/SettingsController.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst SystemSettings = __webpack_require__(/*! Modules/Site/Models/SystemSettings */ \"./Modules/Site/Models/SystemSettings.js\")\r\n\r\nclass SystemSettingsController {\r\n\r\n    static create(req, res, next) {\r\n        try {\r\n            let setting = {\r\n                data: req.body\r\n            }\r\n            if(req.body._id !== \"\"){\r\n                SystemSettings.findOneAndUpdate({_id: req.body._id }, setting ,{upsert: true, new: true},function(error) {\r\n                    if (error) {\r\n                        return res.status(401).json({ error: error, msg: error.message })\r\n                    } else {\r\n                        return res.status(201).json({ msg: 'Settings Successfully updated.' })\r\n                    }\r\n                })\r\n            }else{\r\n                var settings = new SystemSettings(setting)\r\n                settings.save(function(error) {\r\n                    if (error) {\r\n                        return res.status(401).json({ error: error, msg: error.message })\r\n                    } else {\r\n                        return res.status(201).json({ msg: 'Settings Successfully saved.' })\r\n                    }\r\n                })\r\n            }\r\n        } catch (error) {\r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            SystemSettings.findOne({}, null, { sort: { 'createdAt': -1 } }).then((settings) => {\r\n                return res.status(201).json({ settings: settings })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n}\r\nmodule.exports = SystemSettingsController\n\n//# sourceURL=webpack:///./Modules/Site/Controllers/SettingsController.js?");

/***/ }),

/***/ "./Modules/Site/Models/ActivityLog.js":
/*!********************************************!*\
  !*** ./Modules/Site/Models/ActivityLog.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst schema = new Schema({\r\n    user_id: { type: Schema.ObjectId, ref: 'User', default: null },\r\n    description: {\r\n        type: String,\r\n        required: true\r\n    },\r\n    ip_address: {\r\n        type: String,\r\n        required: true\r\n    }\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('ActivityLog', schema)\n\n//# sourceURL=webpack:///./Modules/Site/Models/ActivityLog.js?");

/***/ }),

/***/ "./Modules/Site/Models/Contact.js":
/*!****************************************!*\
  !*** ./Modules/Site/Models/Contact.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst ContactSchema = new Schema({\r\n    full_name: { type: String, required: true },\r\n    phone: { type: String, default: null },\r\n    email: {\r\n        type: String,\r\n        lowercase: true,\r\n        required: true,\r\n        match: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please fill a valid email address'],\r\n    },\r\n    message: { type: String, required: true },\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('Contact', ContactSchema)\n\n//# sourceURL=webpack:///./Modules/Site/Models/Contact.js?");

/***/ }),

/***/ "./Modules/Site/Models/Continent.js":
/*!******************************************!*\
  !*** ./Modules/Site/Models/Continent.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\")\r\n\r\nconst ContinentSchema = new Schema({\r\n    name: { type: String, required: true,index: { unique: true, dropDups: true } },\r\n    description: { type: String, default: null },\r\n    longtitude: { type: String , default: null},\r\n    latitude: { type: String, default: null },\r\n}, { timestamps: true })\r\n\r\nContinentSchema.plugin(uniqueValidator)\r\n\r\nmodule.exports = mongoose.model('Continent', ContinentSchema)\n\n//# sourceURL=webpack:///./Modules/Site/Models/Continent.js?");

/***/ }),

/***/ "./Modules/Site/Models/Country.js":
/*!****************************************!*\
  !*** ./Modules/Site/Models/Country.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\")\r\n\r\nconst CountrytSchema = new Schema({\r\n    name: { type: String, required: true,index: { unique: true, dropDups: true } },\r\n    continent_id: { type: Schema.ObjectId, ref: 'Continent' },\r\n    description: { type: String, default: null },\r\n    longtitude: { type: String , default: null},\r\n    latitude: { type: String, default: null },\r\n}, { timestamps: true })\r\n\r\nCountrytSchema.plugin(uniqueValidator)\r\n\r\nmodule.exports = mongoose.model('Country', CountrytSchema)\n\n//# sourceURL=webpack:///./Modules/Site/Models/Country.js?");

/***/ }),

/***/ "./Modules/Site/Models/Email.js":
/*!**************************************!*\
  !*** ./Modules/Site/Models/Email.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst schema = new Schema({\r\n    email: {\r\n        type: String,\r\n        required: true,\r\n        index: { unique: true, dropDups: true }\r\n    },\r\n    ip_address: {\r\n        type: String,\r\n        required: true\r\n    },\r\n    status:{\r\n        type: Number,\r\n        default: 1\r\n    }\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('EmailAlert', schema)\n\n//# sourceURL=webpack:///./Modules/Site/Models/Email.js?");

/***/ }),

/***/ "./Modules/Site/Models/MailSettings.js":
/*!*********************************************!*\
  !*** ./Modules/Site/Models/MailSettings.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst MailSettingsSchema = new Schema({    \r\n    data: { type: Object },\r\n    is_active: { type: Number, default: 0 },\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('MailSettings', MailSettingsSchema)\n\n//# sourceURL=webpack:///./Modules/Site/Models/MailSettings.js?");

/***/ }),

/***/ "./Modules/Site/Models/SystemSettings.js":
/*!***********************************************!*\
  !*** ./Modules/Site/Models/SystemSettings.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst SystemSettingsSchema = new Schema({\r\n    data: { type: Object },   \r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('SystemSettings', SystemSettingsSchema)\n\n//# sourceURL=webpack:///./Modules/Site/Models/SystemSettings.js?");

/***/ }),

/***/ "./Modules/Site/Routes/index.js":
/*!**************************************!*\
  !*** ./Modules/Site/Routes/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\")\r\nconst router = express.Router()\r\nconst Guard = __webpack_require__(/*! functions/auth */ \"./functions/auth.js\")\r\nconst ExtraController = __webpack_require__(/*! Modules/Site/Controllers/ExtraController */ \"./Modules/Site/Controllers/ExtraController.js\")\r\nconst ContactController = __webpack_require__(/*! Modules/Site/Controllers/ContactController */ \"./Modules/Site/Controllers/ContactController.js\")\r\nconst CountryController = __webpack_require__(/*! Modules/Site/Controllers/CountryController */ \"./Modules/Site/Controllers/CountryController.js\")\r\nconst ContinentController = __webpack_require__(/*! Modules/Site/Controllers/ContinentController */ \"./Modules/Site/Controllers/ContinentController.js\")\r\nconst ActivityController = __webpack_require__(/*! Modules/Site/Controllers/ActivityController */ \"./Modules/Site/Controllers/ActivityController.js\")\r\nconst MailSettingsController = __webpack_require__(/*! Modules/Site/Controllers/MailSettingsController */ \"./Modules/Site/Controllers/MailSettingsController.js\")\r\nconst SystemSettingsController = __webpack_require__(/*! Modules/Site/Controllers/SettingsController */ \"./Modules/Site/Controllers/SettingsController.js\")\r\nconst ContinentSeeder = __webpack_require__(/*! Modules/Site/Seeders/ContinentSeeder */ \"./Modules/Site/Seeders/ContinentSeeder.js\")\r\n\r\nrouter.get('/countries',[Guard.isValidUser], (req, res, next) => {\r\n    CountryController.getAll(req, res, next)\r\n})\r\n\r\nrouter.post('/country/create',[Guard.isValidUser], (req, res, next) => {\r\n    CountryController.create(req, res, next)\r\n})\r\n\r\nrouter.patch('/country/update/:id',[Guard.isValidUser], (req, res, next) => {\r\n    CountryController.update(req, res, next)\r\n})\r\n\r\nrouter.get('/country/:id',[Guard.isValidUser], (req, res, next) => {\r\n    CountryController.getOne(req, res, next)\r\n})\r\n\r\nrouter.get('/continents',[Guard.isValidUser], (req, res, next) => {\r\n    ContinentController.getAll(req, res, next)\r\n})\r\n\r\nrouter.post('/continent/create',[Guard.isValidUser], (req, res, next) => {\r\n    ContinentController.create(req, res, next)\r\n})\r\n\r\nrouter.patch('/continent/update/:id',[Guard.isValidUser], (req, res, next) => {\r\n    ContinentController.update(req, res, next)\r\n})\r\n\r\nrouter.get('/continent/:id',[Guard.isValidUser], (req, res, next) => {\r\n    ContinentController.getOne(req, res, next)\r\n})\r\n\r\nrouter.get('/continent/country/:continent_id',[Guard.isValidUser], (req, res, next) => {\r\n    ContinentController.getAllCountry(req, res, next)\r\n})\r\n\r\nrouter.post('/system/create', (req, res, next) => {\r\n    SystemSettingsController.create(req, res, next)\r\n})\r\n\r\nrouter.get('/system/all', (req, res, next) => {\r\n    SystemSettingsController.getAll(req, res, next)\r\n})\r\n\r\nrouter.post('/mail/create', (req, res, next) => {\r\n    MailSettingsController.create(req, res, next)\r\n})\r\n\r\nrouter.get('/mail/all', (req, res, next) => {\r\n    MailSettingsController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/activities', [Guard.isValidUser], (req, res, next) => {\r\n    ActivityController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/my_activities/:user_id', [Guard.isValidUser], (req, res, next) => {\r\n    ActivityController.getuserAll(req, res, next)\r\n})\r\n\r\nrouter.get('/my_recent_activities/:user_id', [Guard.isValidUser], (req, res, next) => {\r\n    ActivityController.getuserLastFive(req, res, next)\r\n})\r\n\r\nrouter.post('/contact/create', (req, res, next) => {\r\n    ContactController.create(req, res, next)\r\n})\r\n\r\nrouter.get('/contacts',[Guard.isValidUser], (req, res, next) => {\r\n    ContactController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/counts/:user_id', [Guard.isValidUser], (req, res, next) => {\r\n    ExtraController.countUserDoc(req, res, next)\r\n})\r\n\r\nrouter.get('/counts', [Guard.isValidUser], (req, res, next) => {\r\n    ExtraController.countAllDoc(req, res, next)\r\n})\r\n\r\nrouter.post('/email_alert', (req, res, next) => {\r\n    ExtraController.emailAlert(req, res, next)\r\n})\r\n\r\nrouter.get('/unsubscribe/:email', (req, res, next) => {\r\n    ExtraController.deactivateAlertEmail(req, res, next)\r\n})\r\n\r\nrouter.get('/seed/continents', (req, res, next) => {\r\n    ContinentSeeder.seedContinent(req, res, next)\r\n})\r\nrouter.get('/welcome', (req, res, next) => {\r\n   res.send('Welcome clement i will send the api docs soon')\r\n})\r\n\r\nmodule.exports = router\n\n//# sourceURL=webpack:///./Modules/Site/Routes/index.js?");

/***/ }),

/***/ "./Modules/Site/Seeders/ContinentSeeder.js":
/*!*************************************************!*\
  !*** ./Modules/Site/Seeders/ContinentSeeder.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Continent = __webpack_require__(/*! ../Models/Continent */ \"./Modules/Site/Models/Continent.js\")\r\nconst ContinentSeeder = {}\r\n\r\nContinentSeeder.seedContinent = (req, res) => {\r\n    try{\r\n        //deleting all db data\r\n        Continent.remove({ _id: { $ne: null } }).then(() => {\r\n\r\n        }).catch(error => {\r\n            return res.status(422).json({ error: error })\r\n        })\r\n        // create some events\r\n        const continents = [\r\n            { name: 'Africa' },\r\n            { name: 'Europe' },\r\n            { name: 'Asia' },\r\n            { name: 'Australia' },\r\n            { name: 'South America' },\r\n            { name: 'North America' },\r\n            { name: 'Antarctica'}\r\n        ]\r\n\r\n        // use the Continent model to insert/save\r\n        continents.forEach(cont => {\r\n            var newp = new Continent(cont)\r\n            newp.save()\r\n        })\r\n\r\n        // seeded!\r\n        return res.status(201).json({ msg: 'Continent Seeded' })\r\n    } catch (err) {\r\n        return res.status(422).json({ error: err, msg: err.message })\r\n    }\r\n}\r\nmodule.exports = ContinentSeeder\n\n//# sourceURL=webpack:///./Modules/Site/Seeders/ContinentSeeder.js?");

/***/ }),

/***/ "./Modules/Support/Controllers/SupportController.js":
/*!**********************************************************!*\
  !*** ./Modules/Support/Controllers/SupportController.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Support = __webpack_require__(/*! Modules/Support/Models/Support */ \"./Modules/Support/Models/Support.js\")\r\nconst Priority = __webpack_require__(/*! Modules/Support/Models/SupportPriorities */ \"./Modules/Support/Models/SupportPriorities.js\")\r\nconst Replies = __webpack_require__(/*! Modules/Support/Models/SupportReplies */ \"./Modules/Support/Models/SupportReplies.js\")\r\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\n\r\nclass SupportController {\r\n\r\n    static create(req, res, next) {\r\n        try {\r\n            if (!req.body.title) {\r\n                return res.status(422).json({ 'error': 'Please provide title for your support message' })\r\n            }\r\n            if (!req.body.message) {\r\n                return res.status(422).json({ 'error': 'Please provide support message' })\r\n            }\r\n            if (!req.body.dispute_priority_id) {\r\n                return res.status(422).json({ 'error': 'Please provide priority' })\r\n            }\r\n            const support = new Support()\r\n            support.user_id = req.body.user._id\r\n            support.title = req.body.title\r\n            support.dispute_priority_id = req.body.dispute_priority_id\r\n            support.message = req.body.message\r\n            support.ticket_no = crypto.randomBytes(10).toString('hex')\r\n            support.save(function(error) {\r\n                if (error) {\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else {\r\n                    Activity.Email('', 'New Support Message', Activity.html('<p style=\"color: #000\">Hello Administrator', support.message + '<br> from ' + req.body.user.email + ' with the phone number ' + req.body.phone + '.</p>'))\r\n                    Activity.SupportEmail(req, 'New Support Message Recieve ' + support.ticket_no, Activity.html('<p style=\"color: #000\">Hello ' + req.body.user.first_name + \",<br/>Your support message has been recieved, with the Ticket ID \" + support.ticket_no + \". You can track your support mail with your Ticket ID.</p>\"))\r\n                    Activity.activity_log(req, req.body.user_id, req.body.user.first_name + ' Sent Administrator a message')\r\n                    return res.status(201).json({ msg: 'support message Successfully received.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static create_reply(req, res, next) {\r\n        try {\r\n            if (!req.body.message) {\r\n                return res.status(422).json({ 'msg': 'Please provide support message' })\r\n            }\r\n            const reply = new Replies()\r\n            reply.user_id = req.body.user_id\r\n            reply.dispute_id = req.body.dispute_id\r\n            reply.message = req.body.message\r\n            reply.save(function(error) {\r\n                if (error) {\r\n                    return res.status(401).json({ error: error, msg: error.message })\r\n                } else {\r\n                    // Activity.Email('', 'New Support Message', 'Hello Administrator', support.message + '\\n from ' + req.body.user.email + ' with the phone number ' + req.body.phone + '.')\r\n                    // Activity.Email(support, 'New Support Message Recieve ' + support.ticket_no, 'Hello ' + req.body.user.first_name + \", \\n Your support message has been recieved, with the ticket number \" + support.ticket_no + \". You can track your support mail with this number.\")\r\n                    Activity.activity_log(req, req.user_id, ' Sent Administrator a message')\r\n                    return res.status(201).json({ msg: 'support message Successfully replied.' })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(422).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            Support.find({}, null, { sort: { 'createdAt': -1 } }).populate('user_id').then((supports) => {\r\n                return res.status(201).json({ supports: supports })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n\r\n    static getUserSupport(req, res, next) {\r\n        Support.find({ user_id: req.params.user_id }, null, { sort: { 'created_at': -1 } }).populate(\"user_id\").then(function(supports) {\r\n            return res.status(201).json({ supports: supports })\r\n        }, function(error) {\r\n            return res.status(501).json({ \"success\": false, \"message\": error })\r\n        })\r\n    }\r\n\r\n    static getUserReplies(req, res, next) {\r\n        Replies.find({ dispute_id: req.params.dispute_id }, null, { sort: { 'created_at': -1 } }).populate(\"user_id\").populate('dispute_id').then(function(replies) {\r\n            return res.status(201).json({ replies: replies })\r\n        }, function(error) {\r\n            return res.status(501).json({ \"success\": false, \"message\": error })\r\n        })\r\n    }\r\n\r\n    static getSupport(req, res, next) {\r\n        Support.findOne({ _id: req.params._id }).populate(\"user_id\").then(function(support) {\r\n            return res.status(201).json({ support: support })\r\n        }, function(error) {\r\n            return res.status(501).json({ \"success\": false, \"message\": error })\r\n        })\r\n    }\r\n\r\n    static updateSupportStatus(req, res, next) {\r\n        Support.findOne({ _id: req.params._id }).then(function(support) {\r\n            support.status = req.body.status\r\n            support.save()\r\n            return res.status(201).json({ support: support, msg: 'support status updated successfully.' })\r\n        }, function(error) {\r\n            return res.status(501).json({ \"success\": false, \"message\": error })\r\n        })\r\n    }\r\n\r\n    static getPriority(req, res, next) {\r\n        try {\r\n            Priority.find({}).then((priorities) => {\r\n                return res.status(201).json({ priorities: priorities })\r\n            }, (error) => {\r\n                return res.status(501).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } catch (err) {\r\n            return res.status(500).json(err)\r\n        }\r\n    }\r\n}\r\nmodule.exports = SupportController\n\n//# sourceURL=webpack:///./Modules/Support/Controllers/SupportController.js?");

/***/ }),

/***/ "./Modules/Support/Models/Support.js":
/*!*******************************************!*\
  !*** ./Modules/Support/Models/Support.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst SupportSchema = new Schema({\r\n    user_id: { type: Schema.ObjectId, ref: 'User' },\r\n    ticket_no: { type: String, required: true },\r\n    title: { type: String, required: true },\r\n    message: { type: String, required: true },\r\n    status: { type: String, default: 'pending' },\r\n    dispute_priority_id: { type: Schema.ObjectId, ref: 'Priority', required: true }\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('Support', SupportSchema)\n\n//# sourceURL=webpack:///./Modules/Support/Models/Support.js?");

/***/ }),

/***/ "./Modules/Support/Models/SupportPriorities.js":
/*!*****************************************************!*\
  !*** ./Modules/Support/Models/SupportPriorities.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst PrioritySchema = new Schema({\r\n    name: { type: String, required: true },\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('Priority', PrioritySchema)\n\n//# sourceURL=webpack:///./Modules/Support/Models/SupportPriorities.js?");

/***/ }),

/***/ "./Modules/Support/Models/SupportReplies.js":
/*!**************************************************!*\
  !*** ./Modules/Support/Models/SupportReplies.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\n\r\nconst SupportRepliesSchema = new Schema({\r\n    user_id: { type: Schema.ObjectId, ref: 'User' },\r\n    message: { type: String, required: true },\r\n    dispute_id: { type: Schema.ObjectId, ref: 'Support' }\r\n}, { timestamps: true })\r\n\r\nmodule.exports = mongoose.model('SupportReplies', SupportRepliesSchema)\n\n//# sourceURL=webpack:///./Modules/Support/Models/SupportReplies.js?");

/***/ }),

/***/ "./Modules/Support/Routes/index.js":
/*!*****************************************!*\
  !*** ./Modules/Support/Routes/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\")\r\nconst router = express.Router()\r\nconst Guard = __webpack_require__(/*! functions/auth */ \"./functions/auth.js\")\r\nconst SupportController = __webpack_require__(/*! Modules/Support/Controllers/SupportController */ \"./Modules/Support/Controllers/SupportController.js\")\r\nconst Priority = __webpack_require__(/*! Modules/Support/Seeders/prioritySeeder */ \"./Modules/Support/Seeders/prioritySeeder.js\")\r\n\r\nrouter.post('/support/create', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.create(req, res, next)\r\n})\r\n\r\nrouter.post('/support/reply', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.create_reply(req, res, next)\r\n})\r\n\r\nrouter.get('/supports', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/supports/:user_id', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.getUserSupport(req, res, next)\r\n})\r\n\r\nrouter.get('/support/:_id', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.getSupport(req, res, next)\r\n})\r\n\r\nrouter.post('/support/status/:_id', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.updateSupportStatus(req, res, next)\r\n})\r\n\r\nrouter.get('/support/replies/:dispute_id', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.getUserReplies(req, res, next)\r\n})\r\n\r\nrouter.get('/priorities', [Guard.isValidUser], (req, res, next) => {\r\n    SupportController.getPriority(req, res, next)\r\n})\r\nrouter.get('/seed/priority', (req, res, next) => {\r\n    Priority.seedPriorities(req, res)\r\n})\r\n\r\nmodule.exports = router\n\n//# sourceURL=webpack:///./Modules/Support/Routes/index.js?");

/***/ }),

/***/ "./Modules/Support/Seeders/prioritySeeder.js":
/*!***************************************************!*\
  !*** ./Modules/Support/Seeders/prioritySeeder.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Priority = __webpack_require__(/*! Modules/Support/Models/SupportPriorities */ \"./Modules/Support/Models/SupportPriorities.js\")\r\nconst PrioritySeeder = {}\r\n\r\nPrioritySeeder.seedPriorities = (req, res) => {\r\n    //deleting all db data\r\n    try{\r\n        Priority.remove({ _id: { $ne: null } }).then(() => {\r\n        }).catch(error => {\r\n            return res.status(422).json({ error: error })\r\n        })\r\n        // create some events\r\n        const suppport_priorities = [\r\n            { name: 'High' },\r\n            { name: 'Meduim' },\r\n            { name: 'Low' }\r\n        ]\r\n\r\n        // use the Priority model to insert/save\r\n        suppport_priorities.forEach(priority => {\r\n            var newp = new Priority(priority)\r\n            newp.save()\r\n        })\r\n\r\n        // seeded!\r\n        return res.status(201).json({ msg: 'Priority Seeded' })\r\n    }catch(err){\r\n        return res.status(422).json({ error: err, msg: err.message })\r\n    }\r\n    \r\n}\r\nmodule.exports = PrioritySeeder\n\n//# sourceURL=webpack:///./Modules/Support/Seeders/prioritySeeder.js?");

/***/ }),

/***/ "./Modules/User/Controllers/UserController.js":
/*!****************************************************!*\
  !*** ./Modules/User/Controllers/UserController.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\nconst File = __webpack_require__(/*! functions/file */ \"./functions/file.js\")\r\nconst User = __webpack_require__(/*! Modules/User/Models/User */ \"./Modules/User/Models/User.js\")\r\n\r\nclass UserController {    \r\n\r\n    static update(req, res, next) {\r\n        try {\r\n            User.findById(req.params.id, function (error, user) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    user.title = (req.body.title) ? req.body.title : user.title\r\n                    user.first_name = (req.body.first_name) ? req.body.first_name : user.first_name\r\n                    user.last_name = (req.body.last_name) ? req.body.last_name : user.last_name\r\n                    user.email = (req.body.email) ? req.body.email : user.email\r\n                    user.username = (req.body.username) ? req.body.username : user.username\r\n                    user.city = (req.body.city) ? req.body.city : user.city\r\n                    user.country = (req.body.country) ? req.body.country : user.country\r\n                    user.phone = (req.body.phone) ? req.body.phone : user.phone\r\n                    user.postal_code = (req.body.postal_code) ? req.body.postal_code : user.postal_code\r\n                    user.address = (req.body.address) ? req.body.address : user.address\r\n                    user.save(function (error) {\r\n                        if (error) {\r\n                            Activity.activity_log(req, user._id, 'Error Updating Profile!')\r\n                            return res.status(501).json({ error: error, msg: error.message })\r\n                        } else {\r\n                            Activity.Email(user, 'Profile Update', Activity.html('<p style=\"color: #000\">Hello ' + user.first_name + ' ' + user.last_name + ', Your profile has been updated succesfully.</p>'))\r\n                            Activity.activity_log(req, user._id, 'Profile Updated Successfully')\r\n                            return res.status(201).json({\r\n                                'user': user,\r\n                                'msg': user.first_name +\r\n                                    ' Profile Updated Successfully!'\r\n                            })\r\n                        }\r\n                    })\r\n                }\r\n\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getAll(req, res, next) {\r\n        try {\r\n            User.find({ deleted_at: null }, null, { sort: { 'created_at': -1 } }, function (error, users) {\r\n                if (error) return res.json(error)\r\n                return res.json({ users: users })\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static getOne(req, res, next) {\r\n        try {\r\n            User.findOne({ _id: req.params.id, deleted_at: null }, function (error, user) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    return res.status(201).json({ user: user })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static forgetPassword(req, res, next) {\r\n        try {\r\n            User.findOne({ email: req.body.email, deleted_at: null }, function (error, user) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    if (user) {\r\n                        var pword = Activity.makeid(6)\r\n                        user.password = User.hashPassword(pword)\r\n                        Activity.Email(user, 'Forget Password', Activity.html('<p style=\"color: #000\">Hello ' + user.first_name + ' ' + user.last_name + ' This is your new default password.<br><span style=\"color: #1D4BB7\">' + pword + '</span><br/>kindly log on to the application to set a new one.</p>'))\r\n                        user.save()\r\n                        return res.status(201).json({ msg: \"A mail has been sent to you.\" })\r\n                    } else {\r\n                        return res.status(501).json({ msg: 'user not found.' })\r\n                    }\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static resetPassword(req, res, next) {\r\n        try {\r\n            User.findOne({ _id: req.params.id, deleted_at: null }, function (error, user) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    if (user.isValid(req.body.old_password)) {\r\n                        user.password = User.hashPassword(req.body.password)\r\n                        Activity.Email(user, 'Reset Password', Activity.html('<p style=\"color: #000\">Hello ' + user.first_name + ' ' + user.last_name + ',You have successfully reset your password,<br>Thank you.</p>'))\r\n                        user.save()\r\n                        return res.status(201).json({ msg: \"password reset successfully.\" })\r\n                    } else {\r\n                        return res.status(501).json({ msg: \"your old password is incorrect, please check your old password.\" })\r\n                    }\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static delete(req, res, next) {\r\n        try {\r\n            User.findOneAndRemove({ _id: req.params.id, deleted_at: null }, function (error, user) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    return res.json({ user: user, msg: user.first_name + \" was deleted successfully\" })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n    static profileImage(req,res,next){\r\n        try {\r\n            User.findById(req.params.id, function (error, user) {\r\n                if (error) {\r\n                    return res.status(501).json({ error: error, msg: error.message })\r\n                } else {\r\n                    user.profile_image = (req.body.image) ? File.Image(req.body.image, user.username) : ''\r\n                    user.save()\r\n                    return res.status(201).json({ user: user })\r\n                }\r\n            })\r\n        } catch (error) {\r\n            return res.status(501).json({ error: error, msg: error.message })\r\n        }\r\n    }\r\n\r\n}\r\n\r\nmodule.exports = UserController\n\n//# sourceURL=webpack:///./Modules/User/Controllers/UserController.js?");

/***/ }),

/***/ "./Modules/User/Models/User.js":
/*!*************************************!*\
  !*** ./Modules/User/Models/User.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst Schema = mongoose.Schema\r\nconst bcrypt = __webpack_require__(/*! bcryptjs */ \"bcryptjs\")\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\")\r\n\r\nconst UserSchema = new Schema({\r\n    user_type: { type: String, lowercase: true, default: 'user' },\r\n    title: { type: String, required: true },\r\n    first_name: { type: String, required: true },\r\n    last_name: { type: String, required: true },\r\n    username: { type: String, default: null },\r\n    city: { type: String, default: null },\r\n    country: { type: String, default: null },\r\n    postal_code: { type: String, default: null },\r\n    phone: { type: String, default: null },\r\n    profile_image: { type: String, default: ''},\r\n    address: { type: String, default: null },\r\n    email: {\r\n        type: String,\r\n        lowercase: true,\r\n        required: true,\r\n        validate: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please fill a valid email address'],\r\n        match: [/^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/, 'Please fill a valid email address'],\r\n        index: { unique: true, dropDups: true }\r\n\r\n    },\r\n    password: { type: String, required: true },\r\n    is_active: { type: Boolean, required: true, default: false },\r\n    temporarytoken: { type: String, default: null },\r\n    deleted_at: { type: Date, default: null }\r\n}, { timestamps: true })\r\n\r\nUserSchema.statics.hashPassword = function hashPassword(password) {\r\n    return bcrypt.hashSync(password, 10)\r\n}\r\n\r\nUserSchema.methods.isValid = function (hashedPassword) {\r\n    return bcrypt.compareSync(hashedPassword, this.password)\r\n}\r\n\r\nUserSchema.methods.supports = function(){\r\n    return Service.hasMany('Support','user_id',this._id)\r\n}\r\n\r\nUserSchema.plugin(uniqueValidator)\r\nmodule.exports = mongoose.model('User', UserSchema)\n\n//# sourceURL=webpack:///./Modules/User/Models/User.js?");

/***/ }),

/***/ "./Modules/User/Routes/index.js":
/*!**************************************!*\
  !*** ./Modules/User/Routes/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst express = __webpack_require__(/*! express */ \"express\")\r\nconst router = express.Router()\r\nconst Guard = __webpack_require__(/*! functions/auth */ \"./functions/auth.js\")\r\nconst UserController = __webpack_require__(/*! Modules/User/Controllers/UserController */ \"./Modules/User/Controllers/UserController.js\")\r\nconst User = __webpack_require__(/*! Modules/User/Seeders/userSeeder */ \"./Modules/User/Seeders/userSeeder.js\")\r\n\r\nrouter.patch('/user/update/:id', [Guard.isValidUser], (req, res, next) => {\r\n    UserController.update(req, res, next)\r\n})\r\nrouter.get('/users', [Guard.isValidUser], (req, res, next) => {\r\n    UserController.getAll(req, res, next)\r\n})\r\n\r\nrouter.get('/user', [Guard.isValidUser], (req, res, next) => {\r\n    return res.status(200).json(req.user)\r\n})\r\n\r\nrouter.get('/user/:id', [Guard.isValidUser], (req, res, next) => {\r\n    UserController.getOne(req, res, next)\r\n})\r\n\r\nrouter.delete('/user/:id', [Guard.isValidUser], (req, res, next) => {\r\n    UserController.delete(req, res, next)\r\n})\r\n\r\nrouter.post('/forget_password', (req, res, next) => {\r\n    UserController.forgetPassword(req, res, next)\r\n})\r\n\r\nrouter.post('/reset_password/:id', (req, res, next) => {\r\n    UserController.resetPassword(req, res, next)\r\n})\r\n\r\nrouter.get('/users/deleted', [Guard.isValidUser], (req, res, next) => {\r\n    UserController.deletedUser(req, res, next)\r\n})\r\n\r\nrouter.patch('/user/restore/:id', [Guard.isValidUser], (req, res, next) => {\r\n    UserController.restoreOne(req, res, next)\r\n})\r\n\r\nrouter.get('/seed/user', (req, res, next) => {\r\n    User.seedUser(req, res)\r\n})\r\n\r\nmodule.exports = router\n\n//# sourceURL=webpack:///./Modules/User/Routes/index.js?");

/***/ }),

/***/ "./Modules/User/Seeders/userSeeder.js":
/*!********************************************!*\
  !*** ./Modules/User/Seeders/userSeeder.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nconst User = __webpack_require__(/*! Modules/User/Models/User */ \"./Modules/User/Models/User.js\")\r\nconst UserSeeder = {}\r\nconst crypto = __webpack_require__(/*! crypto */ \"crypto\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\n\r\nUserSeeder.seedUser = (req, res) => {\r\n    try {\r\n        // use the User model to insert/save\r\n        var user = new User()\r\n        user.title = \"Mr\"\r\n        user.user_type = 'admin'\r\n        user.first_name = 'Dev'\r\n        user.last_name = 'Admin'\r\n        user.email = 'adedotunolawale@gmail.com'\r\n        user.temporarytoken = crypto.randomBytes(20).toString('hex')\r\n        user.password = User.hashPassword('123456')\r\n        user.save()\r\n\r\n        // User.findOne({ email: 'adedotunolawale@gmail.com' }, function(error, users) {\r\n        //     if (error) {\r\n        //         res.json(error)\r\n        //     } else if (!users) {\r\n        //         res.json({ 'msg': 'token do not math' })\r\n        //     } else {\r\n        //         users.temporarytoken = null\r\n        //         users.is_active = true\r\n        //         Activity.Email(user, 'Account Activated', 'Hello ' + user.first_name + ' ' + user.last_name + ', Thank you for registering at Brax Map. Your Account has been activated successfully.')\r\n        //         //getting mail data\r\n        //         users.save()\r\n        //         return res.status(201).json(users)\r\n        //     }\r\n\r\n        // })\r\n\r\n        // seeded!\r\n        return res.status(201).json({ msg: 'User Seeded', user: user })\r\n    } catch (err) {\r\n        return res.status(422).json({ error: err, msg: err.message })\r\n    }\r\n}\r\n\r\nmodule.exports = UserSeeder\n\n//# sourceURL=webpack:///./Modules/User/Seeders/userSeeder.js?");

/***/ }),

/***/ "./braxmax.json":
/*!**********************!*\
  !*** ./braxmax.json ***!
  \**********************/
/*! exports provided: app_name, email, production, paystack_live_public_key, paystack_live_secret_key, paystack_test_public_key, paystack_test_secret_key, sendgrid_user_name, sendgrid_password, default */
/***/ (function(module) {

eval("module.exports = {\"app_name\":\"MYMAPPAPi\",\"email\":\"adedotunolawale@gmail.com\",\"production\":false,\"paystack_live_public_key\":\"\",\"paystack_live_secret_key\":\"\",\"paystack_test_public_key\":\"pk_test_6e085b9d8e1367800160da63317ae16996326acc\",\"paystack_test_secret_key\":\"sk_test_01b4c8b07c459cb04330d6cf942fcbd55211fb9c\",\"sendgrid_user_name\":\"dollarman2\",\"sendgrid_password\":\"Professionals@2017\"};\n\n//# sourceURL=webpack:///./braxmax.json?");

/***/ }),

/***/ "./config/development.js":
/*!*******************************!*\
  !*** ./config/development.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = development ={\r\n    app:{\r\n        port: process.env.PORT\r\n    },\r\n    db: {\r\n        url: process.env.DEV_URL,\r\n        host: process.env.DEV_DB_HOST,\r\n        port: parseInt(process.env.DEV_DB_PORT) || 27017,\r\n        name: process.env.DEV_DB_DATABASE || 'mymappapi'\r\n    },\r\n    env: 'development'\r\n}\n\n//# sourceURL=webpack:///./config/development.js?");

/***/ }),

/***/ "./config/index.js":
/*!*************************!*\
  !*** ./config/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const local = __webpack_require__(/*! ./local */ \"./config/local.js\")\r\nconst production = __webpack_require__(/*! ./production */ \"./config/production.js\")\r\nconst development = __webpack_require__(/*! ./development */ \"./config/development.js\")\r\n\r\nlet config = {};\r\n\r\nif (false) {} else if (true) {\r\n    config = development;\r\n}else{}\r\nconfig.settings = {\r\n    mail:{\r\n\r\n    },\r\n    system: {\r\n\r\n    }\r\n}\r\n\r\nmodule.exports = config\n\n//# sourceURL=webpack:///./config/index.js?");

/***/ }),

/***/ "./config/local.js":
/*!*************************!*\
  !*** ./config/local.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = local = {\r\n    app: {\r\n        port: process.env.PORT || 6000\r\n    },\r\n    db: {\r\n        url: process.env.DEV_URL || \"mongodb://localhost:27017/mymappapi\",\r\n        host: process.env.DEV_DB_HOST,\r\n        port: parseInt(process.env.DEV_DB_PORT) || 27017,\r\n        name: process.env.DEV_DB_DATABASE || 'mymappapi'\r\n    },\r\n    env: 'development'\r\n}\n\n//# sourceURL=webpack:///./config/local.js?");

/***/ }),

/***/ "./config/production.js":
/*!******************************!*\
  !*** ./config/production.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = production = {\r\n    app: {\r\n        port: process.env.PORT || 5000\r\n    },\r\n    db: {\r\n        url: (process.env.MONGODB_URI) ? process.env.MONGODB_URI : 'mongodb://heroku_gxrddznw:9qariqjloov1pq9k5er3kr8hrk@ds153766.mlab.com:53766/heroku_gxrddznw',\r\n        host: process.env.DB_HOST || 'localhost',\r\n        port: parseInt(process.env.DB_PORT) || 27017,\r\n        name: process.env.DB_DATABASE || 'mymappapi'        \r\n    },\r\n    env: 'production'\r\n}\n\n//# sourceURL=webpack:///./config/production.js?");

/***/ }),

/***/ "./functions/activity.js":
/*!*******************************!*\
  !*** ./functions/activity.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const ActivityLog = __webpack_require__(/*! ../Modules/Site/Models/ActivityLog */ \"./Modules/Site/Models/ActivityLog.js\")\r\nconst EmailAlert = __webpack_require__(/*! ../Modules/Site/Models/Email */ \"./Modules/Site/Models/Email.js\")\r\nconst User = __webpack_require__(/*! ../Modules/User/Models/User */ \"./Modules/User/Models/User.js\")\r\nconst request = __webpack_require__(/*! request */ \"request\")\r\nvar nodemailer = __webpack_require__(/*! nodemailer */ \"nodemailer\")\r\nvar sgTransport = __webpack_require__(/*! nodemailer-sendgrid-transport */ \"nodemailer-sendgrid-transport\")\r\nconst config = __webpack_require__(/*! ../braxmax.json */ \"./braxmax.json\")\r\n\r\nvar options = {\r\n    auth: {\r\n        api_user: process.env.SENDGRID_USERNAME,\r\n        api_key: process.env.SENDGRID_PASSWORD\r\n    }\r\n}\r\n\r\nlet client = nodemailer.createTransport(sgTransport(options))\r\n\r\nvar fs = __webpack_require__(/*! fs */ \"fs\")\r\nconst Activity = {}\r\nvar result = {}\r\nvar trans\r\nvar data = {}\r\n\r\n\r\n\r\nActivity.Base64_encode = function(file) {\r\n    // read binary data\r\n    var bitmap = fs.readFileSync(file)\r\n    // convert binary data to base64 encoded string\r\n    return new Buffer(bitmap).toString('base64')\r\n}\r\n\r\nActivity.makeid = function(length) {\r\n    var text = \"\"\r\n    var possible = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789\"\r\n\r\n    for (var i = 0; i < length; i++){\r\n        text += possible.charAt(Math.floor(Math.random() * possible.length))\r\n    }console.log(text)\r\n    return text\r\n}\r\n\r\nActivity.Email = function(data, subject, message) {\r\n    try {\r\n        var email = {\r\n            from: config.app_name,\r\n            to: (data.email) ? data.email : config.email,\r\n            subject: subject,\r\n            html: message\r\n        }\r\n\r\n        client.sendMail(email, function(err, info) {\r\n            if (err) {\r\n                console.log(err)\r\n            } else {\r\n                console.log(\"Message sent: \" + info.response)\r\n            }\r\n        })\r\n    } catch (error) {\r\n        return res.status(401).json({ \"success\": false, \"message\": error })\r\n    }\r\n}\r\n\r\nActivity.Email1 = function (data, subject, message) {\r\n    try {\r\n        var email = {\r\n            from: 'AdedotunBashorun',\r\n            to: (data.email) ? data.email : 'adedotunolawale@gmail.com',\r\n            subject: subject,\r\n            html: message\r\n        }\r\n\r\n        client.sendMail(email, function (err, info) {\r\n            if (err) {\r\n                console.log(err)\r\n            } else {\r\n                console.log(\"Message sent: \" + info.response)\r\n            }\r\n        })\r\n    } catch (error) {\r\n        return res.status(401).json({ \"success\": false, \"message\": error })\r\n    }\r\n}\r\n\r\nActivity.html = function (data){\r\n    return  '<div id=\"content\" style=\"background-color: #1D4BB7width:100%\">'+\r\n                '<nav>'+\r\n                    '<div class=\"container-fluid\">'+\r\n                            '<span><a href=\"https://sofatotravels.com\"><img src=\"https://sofatotravels.com/static/images/sofato/logo/Sofato-Logo-Allwhite.png\" style=\"width: 120px height: 45px padding:10px\" class=\"img-responsive\"></a></span>'+\r\n                    '</div>'+\r\n                '</nav>'+\r\n                '<div style=\"background-color: #fefefepadding:20pxcolor:#000\">'+ data + '</div>'+\r\n            '</div>'\r\n}\r\n\r\nActivity.html2 = function (data) {\r\n    return '<div id=\"content\" style=\"background-color: #1D4BB7width:100%\">' +\r\n        '<nav>' +\r\n        '<div class=\"container-fluid\">' +\r\n        '<span><a href=\"https://adedotunbashorun.com\"><img src=\"http://www.adedotunbashorun.com/img/bashorun.png\" style=\"width: 120px height: 45px padding:10px\" class=\"img-responsive\"></a></span>' +\r\n        '</div>' +\r\n        '</nav>' +\r\n        '<div style=\"background-color: #fefefepadding:20pxcolor:#000\">' + data + '</div>' +\r\n        '</div>'\r\n}\r\n\r\nActivity.SupportEmail = function(data, subject, message) {\r\n    try {\r\n        var email = {\r\n            from: config.app_name,\r\n            to: (data.user_id) ? data.user_id.email : config.email,\r\n            subject: subject,\r\n            html: message\r\n        }\r\n\r\n        client.sendMail(email, function(err, info) {\r\n            if (err) {\r\n                console.log(err)\r\n            } else {\r\n                console.log(\"Message sent: \" + info.response)\r\n            }\r\n        })\r\n    } catch (error) {\r\n        return res.status(401).json({ \"success\": false, \"message\": error })\r\n    }\r\n}\r\n\r\nActivity.BulkEmail = async(message) => {\r\n    if (message.others !== '' && message.medium === 'email') {\r\n        var str = message.others\r\n        var str_array = str.split(',')\r\n\r\n        for (var i = 0; i < str_array.length; i++) {\r\n            // Trim the excess whitespace.\r\n            str_array[i] = str_array[i].replace(/^\\s*/, \"\").replace(/\\s*$/, \"\")\r\n            // Add additional code here, such as:\r\n            console.log(str_array[i])\r\n            try {\r\n                var email = {\r\n                    from: config.app_name,\r\n                    to: str_array[i],\r\n                    subject: message.title,\r\n                    html: this.html(message.message)\r\n                }\r\n\r\n                client.sendMail(email, function(err, info) {\r\n                    if (err) {\r\n                        console.log(err)\r\n                    } else {\r\n                        console.log(\"Message sent: \" + info.response)\r\n                    }\r\n                })\r\n            } catch (error) {\r\n                console.log(error)\r\n                // return res.status(401).json({ \"success\": false, \"message\": error })\r\n            }\r\n        }\r\n    }\r\n    if (message.receiver === 'subscribers'){\r\n        this.Subscribers(message)\r\n    } else if (message.receiver === 'all users'){\r\n        this.Users(message)\r\n    } else if (message.receiver === 'all') {\r\n        this.Users(message)\r\n        this.Subscribers(message)\r\n    }else{\r\n        User.find({ user_type: message.receiver }, null, { sort: { 'created_at': -1 } }, function(error, users) {\r\n            if (error) return res.json(error)\r\n            for (user of users) {\r\n                try {\r\n                    var email = {\r\n                        from: config.app_name,\r\n                        to: user.email,\r\n                        subject: message.title,\r\n                        html: this.html(message.message)\r\n                    }\r\n\r\n                    client.sendMail(email, function(err, info) {\r\n                        if (err) {\r\n                            console.log(err)\r\n                        } else {\r\n                            console.log(\"Message sent: \" + info.response)\r\n                        }\r\n                    })\r\n                } catch (error) {\r\n                    return res.status(401).json({ \"success\": false, \"message\": error })\r\n                }\r\n            }\r\n        })\r\n    }   \r\n}\r\n\r\nActivity.Subscribers = (message)=>{\r\n    EmailAlert.find({ status: 1 }, null, { sort: { 'created_at': -1 } }, function (error, emails) {\r\n        if (error) return res.json(error)\r\n        for (user of emails) {\r\n            try {\r\n                var email = {\r\n                    from: config.app_name,\r\n                    to: user.email,\r\n                    subject: message.title,\r\n                    html: this.html(message.message)\r\n                }\r\n\r\n                client.sendMail(email, function (err, info) {\r\n                    if (err) {\r\n                        console.log(err)\r\n                    } else {\r\n                        console.log(\"Message sent: \" + info.response)\r\n                    }\r\n                })\r\n            } catch (error) {\r\n                return res.status(401).json({ \"success\": false, \"message\": error })\r\n            }\r\n        }\r\n    })\r\n}\r\n\r\nActivity.Users = (message) => {\r\n    User.find({ deleted_at: null }, null, { sort: { 'created_at': -1 } }, function (error, users) {\r\n        if (error) return res.json(error)\r\n        for (user of users) {\r\n            try {\r\n                var email = {\r\n                    from: config.app_name,\r\n                    to: user.email,\r\n                    subject: message.title,\r\n                    html: this.html(message.message)\r\n                }\r\n\r\n                client.sendMail(email, function (err, info) {\r\n                    if (err) {\r\n                        console.log(err)\r\n                    } else {\r\n                        console.log(\"Message sent: \" + info.response)\r\n                    }\r\n                })\r\n            } catch (error) {\r\n                return res.status(401).json({ \"success\": false, \"message\": error })\r\n            }\r\n        }\r\n    })\r\n}\r\n\r\nActivity.activity_log = async(req, user_id, description) => {\r\n    if (user_id) {\r\n        let logs = new ActivityLog()\r\n        logs.user_id = user_id\r\n        logs.description = description\r\n        logs.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress\r\n        return logs.save()\r\n    }\r\n}\r\n\r\nActivity.alertEmail = async (req) => {\r\n    if (req) {\r\n        let alert = new EmailAlert()\r\n        alert.email = req.body.email\r\n        alert.ip_address = req.header('x-forwarded-for') || req.connection.remoteAddress\r\n        return alert.save()\r\n    }\r\n}\r\n\r\nActivity.Transaction = async(req, res, type) => {\r\n    var options = {\r\n        method: 'POST',\r\n        json: true,\r\n        url: 'https://api.paystack.co/transaction/verify/' + req.body.reference,\r\n        headers: {\r\n            'Authorization': 'Bearer ' + config.paystack_test_secret_key\r\n        }\r\n    }\r\n    request.get(options, (err, body) => {\r\n        if (err) return res.json(err)\r\n        data.transaction = body.body\r\n        trans = new Payment()\r\n        trans.type = type\r\n        trans.reference = req.body.reference\r\n        trans.user_id = req.body.user_id\r\n        trans.status = body.body.data.status\r\n        trans.message = body.body.message\r\n        trans.fees = body.body.data.fees / 100\r\n        trans.fees_split = body.body.data.fees_split / 100\r\n        trans.amount = body.body.data.amount / 100\r\n        trans.save()\r\n        return result.transaction = trans\r\n    })\r\n}\r\n\r\n\r\nmodule.exports = Activity\n\n//# sourceURL=webpack:///./functions/activity.js?");

/***/ }),

/***/ "./functions/auth.js":
/*!***************************!*\
  !*** ./functions/auth.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var passport = __webpack_require__(/*! passport */ \"passport\")\r\nvar User = __webpack_require__(/*! ../Modules/User/Models/User */ \"./Modules/User/Models/User.js\")\r\nmodule.exports = {\r\n    isValidUser: function(req, res, next) {\r\n        if (passport.authenticate('jwt', { session: false })) {\r\n            User.findOne({ temporarytoken: req.headers.authorization }).then(function(user) {\r\n                if (user) next()\r\n                else return res.status(401).json({ \"success\": false, \"message\": \"token is undefined \" })\r\n            }, function(error) {\r\n                return res.status(401).json({ \"success\": false, \"message\": error })\r\n            })\r\n        } else return res.status(401).json({ 'msg': 'UnAuthorized Request!' })\r\n    }\r\n}\n\n//# sourceURL=webpack:///./functions/auth.js?");

/***/ }),

/***/ "./functions/file.js":
/*!***************************!*\
  !*** ./functions/file.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const fs = __webpack_require__(/*! fs */ \"fs\")\r\nconst Activity = __webpack_require__(/*! functions/activity */ \"./functions/activity.js\")\r\nconst userFiles ='public'\r\nvar url = ''\r\n\r\nclass File{\r\n\r\n    static Image(file,dest,name,extension){\r\n        if (typeof file != 'undefined' || file != \"\" || file != null) {\r\n            let check = this.isBase64(file)\r\n            if(check == false){\r\n                let data = Activity.Base64_encode(file.path)\r\n                return this.upload_file(data,dest,name,extension)\r\n            }else{\r\n                return this.upload_file(file,dest,name,extension)\r\n            }\r\n            \r\n        }\r\n        return ''\r\n    }\r\n\r\n    static generalFile(file,dest,name,extension){\r\n        if (typeof file != 'undefined' || file != \"\" || file != null) {\r\n            let check = this.isBase64(file)\r\n            if(check == false){\r\n                let data = Activity.Base64_encode(file.path)\r\n                return this.upload_file(data,dest,name,extension)\r\n            }else{\r\n                return this.upload_file(file,dest,name,extension)\r\n            }\r\n        }\r\n        return ''\r\n    }\r\n\r\n    static zipFile(file,name,extension) {\r\n\r\n    }\r\n\r\n    static isBase64(str) {\r\n        try {\r\n            return btoa(atob(str)) == str;\r\n        } catch (err) {\r\n            return false;\r\n        }\r\n    }\r\n\r\n    static upload_file(file,dest,name,extension = ''){\r\n        var image = file.replace(/^data:.*,/, '')\r\n        image = image.replace(/ /g, '+')\r\n        var bitmap = new Buffer(image, 'base64')\r\n        url = userFiles+ dest+ name +'-'+ Date.now() + extension\r\n        fs.writeFileSync(url, bitmap)\r\n        return url\r\n    }\r\n\r\n    \r\n}\r\n\r\nmodule.exports = File\n\n//# sourceURL=webpack:///./functions/file.js?");

/***/ }),

/***/ "./passport-config.js":
/*!****************************!*\
  !*** ./passport-config.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var passport = __webpack_require__(/*! passport */ \"passport\"),\r\n    LocalStrategy = __webpack_require__(/*! passport-local */ \"passport-local\").Strategy;\r\nconst passportJWT = __webpack_require__(/*! passport-jwt */ \"passport-jwt\");\r\nconst JWTStrategy = passportJWT.Strategy;\r\nconst ExtractJWT = passportJWT.ExtractJwt;\r\nconst User = __webpack_require__(/*! ./Modules/User/Models/User */ \"./Modules/User/Models/User.js\");\r\npassport.use('local', new LocalStrategy({\r\n        usernameField: 'email',\r\n        passwordField: 'password'\r\n    },\r\n    function(username, password, done) {\r\n        User.findOne({ email: username }, function(err, user) {\r\n            if (err) { return done(err); }\r\n            if (!user) {\r\n                return done(null, false, { message: 'Incorrect username.' });\r\n            }\r\n            if (!user.isValid(password)) {\r\n                return done(null, false, { message: 'Incorrect password.' });\r\n            }\r\n            if (user.is_active == false) {\r\n                return done(null, false, { message: 'User Not Activated.' });\r\n            }\r\n            return done(null, user);\r\n        });\r\n    }\r\n));\r\n\r\npassport.serializeUser(function(user, done) {\r\n    done(null, user._id);\r\n});\r\n\r\npassport.deserializeUser(function(id, done) {\r\n    User.findById(id, function(err, user) {\r\n        done(err, user);\r\n    });\r\n});\r\n\r\npassport.use(new JWTStrategy({\r\n        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),\r\n        secretOrKey: 'BraxMap'\r\n    },\r\n    function(jwtPayload, cb) {\r\n        \r\n        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.\r\n        return User.findById(jwtPayload.id)\r\n            .then(user => {\r\n                return cb(null, user);\r\n            })\r\n            .catch(err => {\r\n                return cb(err);\r\n            });\r\n    }\r\n));\n\n//# sourceURL=webpack:///./passport-config.js?");

/***/ }),

/***/ "./server.js":
/*!*******************!*\
  !*** ./server.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {var express = __webpack_require__(/*! express */ \"express\")\r\nvar morgan = __webpack_require__(/*! morgan */ \"morgan\")\r\nvar bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\")\r\nvar path = __webpack_require__(/*! path */ \"path\")\r\nvar mongoose = __webpack_require__(/*! mongoose */ \"mongoose\")\r\nconst formData = __webpack_require__(/*! express-form-data */ \"express-form-data\")\r\nconst os = __webpack_require__(/*! os */ \"os\")\r\nvar cors = __webpack_require__(/*! cors */ \"cors\")\r\n\r\nconst config = __webpack_require__(/*! ./config */ \"./config/index.js\")\r\n\r\nconst app = express()\r\n\r\nvar passport = __webpack_require__(/*! passport */ \"passport\")\r\n\r\nconst port = config.app.port\r\n\r\ntry {\r\n    mongoose.set('useCreateIndex', true)\r\n    //config.db.url\r\n    mongoose.connect(\"mongodb://heroku_gxrddznw:9qariqjloov1pq9k5er3kr8hrk@ds153766.mlab.com:53766/heroku_gxrddznw\", { useNewUrlParser: true }).then(() => { // if all is ok we will be here\r\n        console.log(\"connected\")\r\n    }).catch(err => { // we will not be here...\r\n        console.error('App starting error: Network Issue')\r\n        return { error: err.stack, message: \"Error Connecting to mongo db\" }\r\n        process.exit()\r\n    })\r\n} catch (err) {\r\n    console.log(err)\r\n}\r\n\r\n__webpack_require__(/*! ./passport-config */ \"./passport-config.js\")\r\n\r\nconst options = {\r\n    uploadDir: os.tmpdir(),\r\n    autoClean: true\r\n}\r\n\r\napp.use(passport.initialize())\r\napp.use(passport.session())\r\n\r\napp.use(cors({\r\n    origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://www.adedotunbashorun.com', 'https://adedotunbashorun.herokuapp.com', 'http://localhost:3000'],\r\n    credentials: true\r\n}))\r\n\r\napp.use(morgan('dev'))\r\n\r\nconst authRoutes = __webpack_require__(/*! ./Modules/Authentication/Routes */ \"./Modules/Authentication/Routes/index.js\")\r\nconst userRoutes = __webpack_require__(/*! ./Modules/User/Routes */ \"./Modules/User/Routes/index.js\")\r\nconst siteRoutes = __webpack_require__(/*! ./Modules/Site/Routes */ \"./Modules/Site/Routes/index.js\")\r\nconst mapRoutes = __webpack_require__(/*! ./Modules/Map/Routes */ \"./Modules/Map/Routes/index.js\")\r\nconst bulkRoute = __webpack_require__(/*! ./Modules/BulkMessage/Routes */ \"./Modules/BulkMessage/Routes/index.js\")\r\nconst supportRoutes = __webpack_require__(/*! ./Modules/Support/Routes */ \"./Modules/Support/Routes/index.js\")\r\n\r\napp.use(bodyParser.json());\r\napp.use(bodyParser.urlencoded({ extended: false }));\r\n// parse data with connect-multiparty. \r\napp.use(formData.parse(options));\r\n// clear from the request and delete all empty files (size == 0)\r\napp.use(formData.format());\r\n// change file objects to stream.Readable \r\napp.use(formData.stream());\r\n// union body and files\r\napp.use(formData.union());\r\n\r\napp.use(express.json({ limit: '50mb' }))\r\napp.use(express.urlencoded({ limit: '50mb', extended: false }))\r\n\r\napp.use('/api', authRoutes)\r\napp.use('/api', userRoutes)\r\napp.use('/api', siteRoutes)\r\napp.use('/api', mapRoutes)\r\napp.use('/api', bulkRoute)\r\napp.use('/api', supportRoutes)\r\n\r\n//set static folder\r\napp.use(express.static(path.join(__dirname, '/dist')))\r\napp.use('/', express.static(path.join(__dirname,'')))\r\n\r\n\r\n\r\napp.set('port',port)\r\n\r\nmodule.exports = app\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./server.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var http = __webpack_require__(/*! http */ \"http\");\r\nvar app = __webpack_require__(/*! ../server */ \"./server.js\"); // Notice the additional () here\r\n\r\nhttp.createServer(app).listen(app.get('port'), function() {\r\n    console.log('server started at http://localhost:'+app.get('port'));\r\n});\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcryptjs\");\n\n//# sourceURL=webpack:///external_%22bcryptjs%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-form-data":
/*!************************************!*\
  !*** external "express-form-data" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-form-data\");\n\n//# sourceURL=webpack:///external_%22express-form-data%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "mongoose-unique-validator":
/*!********************************************!*\
  !*** external "mongoose-unique-validator" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose-unique-validator\");\n\n//# sourceURL=webpack:///external_%22mongoose-unique-validator%22?");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"morgan\");\n\n//# sourceURL=webpack:///external_%22morgan%22?");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodemailer\");\n\n//# sourceURL=webpack:///external_%22nodemailer%22?");

/***/ }),

/***/ "nodemailer-sendgrid-transport":
/*!************************************************!*\
  !*** external "nodemailer-sendgrid-transport" ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"nodemailer-sendgrid-transport\");\n\n//# sourceURL=webpack:///external_%22nodemailer-sendgrid-transport%22?");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"os\");\n\n//# sourceURL=webpack:///external_%22os%22?");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport\");\n\n//# sourceURL=webpack:///external_%22passport%22?");

/***/ }),

/***/ "passport-jwt":
/*!*******************************!*\
  !*** external "passport-jwt" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-jwt\");\n\n//# sourceURL=webpack:///external_%22passport-jwt%22?");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-local\");\n\n//# sourceURL=webpack:///external_%22passport-local%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"request\");\n\n//# sourceURL=webpack:///external_%22request%22?");

/***/ })

/******/ });