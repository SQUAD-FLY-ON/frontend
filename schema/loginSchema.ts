import { z } from "zod";

export const loginSchema = z.object({
   loginId: z.string().min(5, { message: '아이디는 5글자 이상이어야 합니다.' }),
  password: z.string().min(8, { message: '비밀번호는 8글자 이상이어야 합니다.' }),
});