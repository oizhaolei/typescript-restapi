import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";




@ObjectType({ description: "The Category model" })
export class Category {
    @Field(()=> ID)
    id: string;  

    @Field()
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;
}


export const CategoryModel = getModelForClass(Category);


