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
import ticketController from '../controllers/ticket.controller'
import bannerController from '../controllers/banner.controller'

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
   * #swagger.tags = ['Ticket']
   * #swagger.security = [{ "bearerAuth": {} }]
   * #swagger.requestBody = {
     required: true,
     schema: { $ref: "#/components/schemas/CreateTicketRequest" }
   }
   */
  "/tickets",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.create,
)
router.get(
  /*
   * #swagger.tags = ['Ticket']
   */
  "/tickets",
  ticketController.findAll,
)
router.get(
  /*
   * #swagger.tags = ['Ticket']
   */
  "/tickets/:id",
  ticketController.findOne,
)
router.put(
  /*
   * #swagger.tags = ['Ticket']
   * #swagger.security = [{ "bearerAuth": {} }]
   * #swagger.requestBody = {
     required: true,
     schema: { $ref: "#/components/schemas/CreateTicketRequest" }
   }
   */
  "/tickets/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.update,
)
router.delete(
  /*
   * #swagger.tags = ['Ticket']
   * #swagger.security = [{ "bearerAuth": {} }]
   */
  "/tickets/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  ticketController.remove,
)
router.get(
  /*
   * #swagger.tags = ['Ticket']
   */
  "/tickets/:eventId/events",
  ticketController.findAllByEvent,
)

router.post(
  "/orders",
  [authMiddleware, aclMiddleware([ROLES.MEMBER])],
  orderController.create
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateOrderRequest"
    }
  }
  */
);
router.get(
  "/orders",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  orderController.findAll
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  */
);
router.get(
  "/orders/:orderId",
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
  orderController.findOne
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  */
);
router.put(
  "/orders/:orderId/completed",
  [authMiddleware, aclMiddleware([ROLES.MEMBER])],
  orderController.complete
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  */
);
router.put(
  "/orders/:orderId/pending",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  orderController.pending
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  */
);
router.put(
  "/orders/:orderId/cancelled",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  orderController.cancelled
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  */
);

router.get(
  "/orders-history",
  [authMiddleware, aclMiddleware([ROLES.MEMBER])],
  orderController.findAllByMember
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  */
);

router.delete(
  "/orders/:orderId",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  orderController.remove
  /*
  #swagger.tags = ['Order']
  #swagger.security = [{
    "bearerAuth": ""
  }]
  */
);

router.post(
  /*
   * #swagger.tags = ['Banner']
   * #swagger.security = [{ "bearerAuth": {} }]
   * #swagger.requestBody = {
     required: true,
     schema: { $ref: "#/components/schemas/CreateBannerRequest" }
   }
   */
  "/banners",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.create,
)
router.get(
  /*
   * #swagger.tags = ['Banner']
   */
  "/banners",
  bannerController.findAll,
)
router.get(
  /*
   * #swagger.tags = ['Banner']
   */
  "/banners/:id",
  bannerController.findOne,
)
router.put(
  /*
   * #swagger.tags = ['Banner']
   * #swagger.security = [{ "bearerAuth": {} }]
   * #swagger.requestBody = {
     required: true,
     schema: { $ref: "#/components/schemas/CreateBannerRequest" }
   }
   */
  "/banners/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.update,
)
router.delete(
  /*
   * #swagger.tags = ['Banner']
   * #swagger.security = [{ "bearerAuth": {} }]
   */
  "/banners/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  bannerController.remove,
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
      #swagger.parameters['limit'] = {
        in: 'query', 
        type: 'number',
        default: 10
      }
      #swagger.parameters['page'] = {
        in: 'query', 
        type: 'number',
        default: 1
      }
      #swagger.parameters['category'] = {
        in: 'query', 
        type: 'string'
      }
      #swagger.parameters['isOnline'] = {
        in: 'query', 
        type: 'boolean'
      }
      #swagger.parameters['isFeatured'] = {
        in: 'query', 
        type: 'boolean'
      }
      #swagger.parameters['isPublish'] = {
        in: 'query', 
        type: 'boolean'
      }
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
