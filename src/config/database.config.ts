import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb+srv://bhushanpawar2112001:bdlNJfpzX1I1OA4s@kryupa.6elfh.mongodb.net/hostel_management',
})); 