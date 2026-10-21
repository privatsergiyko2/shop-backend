import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Counter {
  @Prop({ unique: true })
  name: string;

  @Prop()
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
