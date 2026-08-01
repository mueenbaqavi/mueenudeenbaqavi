import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: "ബന്ധപ്പെടുക", path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHero title="ബന്ധപ്പെടുക" description="Address, WhatsApp, Email, Google Map, validated contact form എന്നിവയ്ക്കുള്ള പേജ്." />
      <section className="container grid gap-8 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-4">
          <Card><CardContent className="flex gap-3 pt-5"><MapPin className="size-5 text-primary" />{siteConfig.address}</CardContent></Card>
          <Card><CardContent className="flex gap-3 pt-5"><Phone className="size-5 text-primary" />{siteConfig.phone}</CardContent></Card>
          
          <div className="mt-4 flex flex-col gap-3">
            <a href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("അസ്സലാമു അലൈക്കും.")}`} target="_blank" rel="noopener noreferrer">
              <Button className="w-full justify-start text-lg h-14" variant="outline">
                <MessageCircle className="mr-3 size-5 text-green-500" /> WhatsApp Message
              </Button>
            </a>
            <a href="https://t.me/mueenuddeen" target="_blank" rel="noopener noreferrer">
              <Button className="w-full justify-start text-lg h-14" variant="outline">
                <Send className="mr-3 size-5 text-blue-500" /> Telegram: @mueenuddeen
              </Button>
            </a>
            <a href="https://www.facebook.com/pcmsunni" target="_blank" rel="noopener noreferrer">
              <Button className="w-full justify-start text-lg h-14" variant="outline">
                <svg className="mr-3 size-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg> 
                Facebook Page
              </Button>
            </a>
          </div>
        </div>
        <Card className="overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15655.394708350519!2d76.0087596!3d11.1988298!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba647001fd49c75%3A0xb196e7617bd474c4!2sSHIHAB%20THANGAL%20NAGAR%2Cfathima%20road!5e0!3m2!1sen!2sin!4v1785594658955!5m2!1sen!2sin" 
            className="w-full h-full min-h-[450px]" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Card>
      </section>
    </>
  );
}
