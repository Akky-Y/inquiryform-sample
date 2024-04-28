import { formSchema } from "@/lib/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";

export const useMailForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      subject: "",
      email: "",
      content: "",
      file: undefined,
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    const { username, subject, email, content, file } = values;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("subject", subject);
    formData.append("email", email);
    formData.append("content", content);
    formData.append("file", file[0]);

    try {
      await fetch("/api/send", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return { form, onSubmit };
};
