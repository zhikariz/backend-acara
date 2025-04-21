import express from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import authController from '../controllers/auth.controller'
import aclMiddleware from '../middlewares/acl.middleware'
import { ROLES } from '../utils/constant'
import mediaMiddleware from '../middlewares/media.middleware'
import mediaController from '../controllers/media.controller'
import categoryController from '../controllers/category.controller'
import regionController from '../controllers/region.controller'
import eventController from '../controllers/event.controller'

const router = express.Router()

router.post(
  /* 
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
       required: true, 
       schema: { $ref: "#/components/schemas/RegisterRequest" }
     }
  */
  '/auth/register',
  authController.register
)
router.post(
  /*
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
       required: true, 
       schema: { $ref: "#/components/schemas/LoginRequest" }
     }
  */
  '/auth/login',
  authController.login
)
router.get(
  /*
      #swagger.tags = ['Auth']
      #swagger.security = [{
        "bearerAuth": []
      }]
  */
  '/auth/me',
  authMiddleware,
  authController.me
)
router.post(
  /*
      #swagger.tags = ['Auth']
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/ActivationRequest" }
      }
  */
  '/auth/activation',
  authController.activation
)

router.post(
  /*
      #swagger.tags = ['Category']
      #swagger.security = [{ "bearerAuth": {} }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/CreateCategoryRequest" }
      }
   */
  "/category",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.create
)
router.get(
  /*
      #swagger.tags = ['Category']
  */
  "/category",
  categoryController.findAll
)
router.get(
  /*
      #swagger.tags = ['Category']
  */
  "/category/:id",
  categoryController.findOne,
)
router.put(
  /*
      #swagger.tags = ['Category']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/CreateCategoryRequest" }
      }
  */
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.update
)
router.delete(
  /*
      #swagger.tags = ['Category']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
  */
  "/category/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  categoryController.remove
)

router.post(
  /*
      #swagger.tags = ['Events']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/CreateEventRequest" }
      }
  */
  "/events",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.create
)
router.get(
  /*
      #swagger.tags = ['Events']
  */
  "/events",
  eventController.findAll
)
router.get(
  /*
      #swagger.tags = ['Events']
  */
  "/events/:id",
  eventController.findOne
)
router.put(
  /*
      #swagger.tags = ['Events']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/CreateEventRequest" }
      }
  */
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update

)
router.delete(
  /*
      #swagger.tags = ['Events']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
  */
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
)
router.get(
  /*
      #swagger.tags = ['Events']
  */
  "/events/:slug/slug",
  eventController.findOneBySlug
)


router.get(
  /*
      #swagger.tags = ['Region']
  */
  '/regions',
  regionController.getAllProvinces
)
router.get(
  /*
      #swagger.tags = ['Region']
  */
  '/regions/:id/province',
  regionController.getProvince
)
router.get(
  /*
      #swagger.tags = ['Region']
  */
  '/regions/:id/regency',
  regionController.getRegency
)
router.get(
  /*
      #swagger.tags = ['Region']
  */
  '/regions/:id/district',
  regionController.getDistrict
)
router.get(
  /*
      #swagger.tags = ['Region']
  */
  '/regions/:id/village',
  regionController.getVillage
)
router.get(
  /*
      #swagger.tags = ['Region']
  */
  '/regions-search',
  regionController.findByCity
)

router.post('/media/upload-single', [
  /*
      #swagger.tags = ['Media']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
      #swagger.requestBody = {
        required: true,
        content: { 
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["file"],
              properties: {
                file: {
                  type: "string",
                  format: "binary"
                }
              }
            }
          }
        }
      }
  */
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  mediaMiddleware.single("file")
], mediaController.single)
router.post('/media/upload-multiple', [
  /*
      #swagger.tags = ['Media']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
      #swagger.requestBody = {
        required: true,
        content: { 
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["files"],
              properties: {
                files: {
                  type: "array",
                  items: {
                    type: "string", 
                    format: "binary"
                  },
                }
              }
            }
          }
        }
      }
  */
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
  mediaMiddleware.multiple("files")
], mediaController.multiple)
router.delete('/media/remove', [
  /*
      #swagger.tags = ['Media']
      #swagger.security = [{ 
        "bearerAuth": {} 
      }]
      #swagger.requestBody = {
        required: true,
        schema: { $ref: "#/components/schemas/RemoveMediaRequest" }
      }
  */
  authMiddleware,
  aclMiddleware([ROLES.ADMIN, ROLES.MEMBER]),
], mediaController.remove)


export default router
