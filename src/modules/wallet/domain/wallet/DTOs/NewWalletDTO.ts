import { IsIn, IsNotEmpty } from "class-validator";

export class NewWalletDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    ownerId: string;
    @IsIn(["PERSONAL", "BUSINESS"])
    type: string;
   }