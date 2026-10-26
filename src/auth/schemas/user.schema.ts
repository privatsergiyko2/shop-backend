import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true})
  password: string;

  @Prop({ type: Number, default: 1 })
  role: number;
}


export const UserSchema = SchemaFactory.createForClass(User);