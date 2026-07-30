"use client"

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"
import * as z from "zod"
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation'
import posthog from "posthog-js"

const formSchema = z.object({
    url: z.httpUrl()
})

export default function UrlBar({domain} : {domain: string}) {

    const router = useRouter()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "https://",
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>){
        posthog.capture("site_url_submitted")
        const httpsRemoved = data.url.replace("https://", "");
        const httpRemoved = httpsRemoved.replace("http://", "");
        router.push(`/${httpRemoved}`);
        form.reset();
    }

    return (
        <div >
            <form id="urlbar-form" onSubmit={form.handleSubmit(onSubmit)} className="w-1/9">
                <FieldGroup>
                    <Controller
                        name="url"
                        control={form.control}
                        render={({ field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <InputGroup className="w-full">
                                    <InputGroupInput
                                        {...field}
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                        placeholder="https://......." id="urlbar-in"
                                        className="w-full"
                                    />
                                    <InputGroupAddon>
                                        <Search/>
                                    </InputGroupAddon>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </InputGroup>
                            </Field>
                        )}
                    />
                </FieldGroup>
            </form>
        </div>
    )
}