import { AppDataSource } from "../config/dataSource";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product.repository";

interface IProduct {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  stock: number;
  isOffer?: boolean;
}

const descriptionFor = (name: string) =>
  `${name} seleccionado por Zentra por su diseno, rendimiento y calidad para una experiencia tecnologica confiable.`;

const productsToPreLoad: IProduct[] = [
  { name: "iPhone 11", price: 1293000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734524/zentra/products/iphone-11.png", categoryId: 1, stock: 10, description: descriptionFor("iPhone 11") },
  { name: "iPhone 14 Pro", price: 2033000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734529/zentra/products/iphone-14-pro-purple.png", categoryId: 1, stock: 8, description: descriptionFor("iPhone 14 Pro") },
  { name: "iPhone 15 Pro", price: 2403000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734544/zentra/products/iphone-15-pro.png", categoryId: 1, stock: 7, description: descriptionFor("iPhone 15 Pro") },
  { name: "Samsung Galaxy S23", price: 1848000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734807/zentra/products/samsung_galaxy_s23.png", categoryId: 1, stock: 9, description: descriptionFor("Samsung Galaxy S23") },
  { name: "Galaxy S23", price: 1756000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734426/zentra/products/galaxy-s23.png", categoryId: 1, stock: 6, description: descriptionFor("Galaxy S23") },
  { name: "Google Pixel 8 Pro", price: 1663000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734438/zentra/products/google-pixel-8-pro.png", categoryId: 1, stock: 8, description: descriptionFor("Google Pixel 8 Pro") },
  { name: "Pixel 8", price: 1386000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734723/zentra/products/pixel-8.png", categoryId: 1, stock: 10, description: descriptionFor("Pixel 8") },
  { name: "OnePlus 12", price: 1478000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734707/zentra/products/oneplus-12.png", categoryId: 1, stock: 7, description: descriptionFor("OnePlus 12") },
  { name: "Nothing Phone 2", price: 1293000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734703/zentra/products/nothing-phone-2.png", categoryId: 1, stock: 8, description: descriptionFor("Nothing Phone 2") },
  { name: "Motorola Edge 50 Pro", price: 1201000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734687/zentra/products/motorola-edge-50-pro.png", categoryId: 1, stock: 9, description: descriptionFor("Motorola Edge 50 Pro") },
  { name: "Xiaomi 14 Pro", price: 1478000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735010/zentra/products/xiaomi-14-pro.png", categoryId: 1, stock: 8, description: descriptionFor("Xiaomi 14 Pro"), isOffer: true },

  { name: "MacBook Air", price: 1848000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734641/zentra/products/macbook-air.png", categoryId: 2, stock: 10, description: descriptionFor("MacBook Air") },
  { name: "MacBook Air M2", price: 2218000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734636/zentra/products/macbook-air-2.png", categoryId: 2, stock: 7, description: descriptionFor("MacBook Air M2") },
  { name: "MacBook Pro M2", price: 3513000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734650/zentra/products/macbook_pro_m2.png", categoryId: 2, stock: 6, description: descriptionFor("MacBook Pro M2") },
  { name: "Dell XPS 13", price: 2588000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734408/zentra/products/dell-xps-13.png", categoryId: 2, stock: 7, description: descriptionFor("Dell XPS 13") },
  { name: "Dell Inspiron 15", price: 1478000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734396/zentra/products/dell-inspiron-15.png", categoryId: 2, stock: 10, description: descriptionFor("Dell Inspiron 15") },
  { name: "Acer Swift 3", price: 1386000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734072/zentra/products/acer-swift-3.png", categoryId: 2, stock: 9, description: descriptionFor("Acer Swift 3") },
  { name: "HP Spectre x360", price: 2403000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734469/zentra/products/hp-spectre-x360.png", categoryId: 2, stock: 5, description: descriptionFor("HP Spectre x360") },
  { name: "Lenovo Legion 5 Pro", price: 2773000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734599/zentra/products/lenovo-legion-5-pro.png", categoryId: 2, stock: 6, description: descriptionFor("Lenovo Legion 5 Pro") },
  { name: "ASUS ROG Gamer", price: 2958000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734129/zentra/products/asus-rog-gamer.png", categoryId: 2, stock: 5, description: descriptionFor("ASUS ROG Gamer"), isOffer: true },
  { name: "Microsoft Surface Laptop 5", price: 2218000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734671/zentra/products/microsoft-surface-laptop-5.png", categoryId: 2, stock: 8, description: descriptionFor("Microsoft Surface Laptop 5") },
  { name: "Samsung Galaxy Book3 Ultra", price: 3328000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734790/zentra/products/samsung-galaxy-book3-ultra.png", categoryId: 2, stock: 4, description: descriptionFor("Samsung Galaxy Book3 Ultra") },

  { name: "iPad Pro", price: 1478000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734497/zentra/products/ipad-pro.png", categoryId: 3, stock: 10, description: descriptionFor("iPad Pro") },
  { name: "iPad Pro 12.9", price: 1848000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734508/zentra/products/ipad-pro2.png", categoryId: 3, stock: 8, description: descriptionFor("iPad Pro 12.9") },
  { name: "iPad Air", price: 1293000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734519/zentra/products/ipad_air.png", categoryId: 3, stock: 9, description: descriptionFor("iPad Air") },
  { name: "Galaxy Tab S9 Ultra", price: 1848000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734430/zentra/products/galaxy-tab-s9-ultra.png", categoryId: 3, stock: 7, description: descriptionFor("Galaxy Tab S9 Ultra") },
  { name: "Lenovo Tab P12 Pro", price: 1071000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734612/zentra/products/lenovo-tab-p12-pro.png", categoryId: 3, stock: 9, description: descriptionFor("Lenovo Tab P12 Pro") },
  { name: "Huawei MatePad Pro", price: 1201000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734479/zentra/products/huawei-matepad-pro.png", categoryId: 3, stock: 8, description: descriptionFor("Huawei MatePad Pro") },
  { name: "Google Pixel Tablet", price: 923000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734447/zentra/products/google-pixel-tablet.png", categoryId: 3, stock: 10, description: descriptionFor("Google Pixel Tablet") },
  { name: "OnePlus Pad", price: 886000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734713/zentra/products/oneplus-pad.png", categoryId: 3, stock: 9, description: descriptionFor("OnePlus Pad") },
  { name: "Xiaomi Pad 6", price: 738000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735014/zentra/products/xiaomi-pad-6.png", categoryId: 3, stock: 11, description: descriptionFor("Xiaomi Pad 6") },
  { name: "Amazon Fire HD 10", price: 368000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734106/zentra/products/amazon-fire-hd-10.png", categoryId: 3, stock: 12, description: descriptionFor("Amazon Fire HD 10"), isOffer: true },

  { name: "Apple Watch Series 6", price: 738000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734113/zentra/products/apple-watch-series-6.png", categoryId: 9, stock: 10, description: descriptionFor("Apple Watch Series 6") },

  { name: "AirPods Pro", price: 461000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734092/zentra/products/airpods-pro.png", categoryId: 4, stock: 10, description: descriptionFor("AirPods Pro") },
  { name: "AirPods Pro 2", price: 516000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734086/zentra/products/airpods-pro-2.png", categoryId: 4, stock: 9, description: descriptionFor("AirPods Pro 2") },
  { name: "Bose QuietComfort 45", price: 609000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734133/zentra/products/bose-quietcomfort-45.png", categoryId: 4, stock: 8, description: descriptionFor("Bose QuietComfort 45") },
  { name: "Beats Solo3 Wireless", price: 368000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734130/zentra/products/beats-solo3-wireless-pink.png", categoryId: 4, stock: 10, description: descriptionFor("Beats Solo3 Wireless") },
  { name: "Anker Soundcore Space One", price: 239000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734110/zentra/products/anker-soundcore-space-one.png", categoryId: 4, stock: 12, description: descriptionFor("Anker Soundcore Space One"), isOffer: true },
  { name: "JBL Tune 760NC", price: 276000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734571/zentra/products/jbl-tune-760nc.png", categoryId: 4, stock: 10, description: descriptionFor("JBL Tune 760NC") },
  { name: "Sony WH-1000XM5", price: 738000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735003/zentra/products/sony-wh1000xm5.png", categoryId: 4, stock: 7, description: descriptionFor("Sony WH-1000XM5") },
  { name: "Sony WF-C700N", price: 220000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735006/zentra/products/sony-wf-c700n-beige.png", categoryId: 4, stock: 11, description: descriptionFor("Sony WF-C700N") },
  { name: "Sennheiser Momentum 4", price: 646000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734995/zentra/products/sennheiser-momentum-4.png", categoryId: 4, stock: 7, description: descriptionFor("Sennheiser Momentum 4") },
  { name: "Motorola Headphones", price: 183000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734690/zentra/products/motorola-headphones-blue.png", categoryId: 4, stock: 12, description: descriptionFor("Motorola Headphones") },
  { name: "JBL Flip 6", price: 239000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734557/zentra/products/jbl-flip-6-blue.png", categoryId: 4, stock: 12, description: descriptionFor("JBL Flip 6") },
  { name: "HomePod mini", price: 183000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734454/zentra/products/homepod-mini.png", categoryId: 4, stock: 10, description: descriptionFor("HomePod mini") },

  { name: "Canon EOS R50", price: 1478000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734160/zentra/products/canon-eos-r50.png", categoryId: 5, stock: 7, description: descriptionFor("Canon EOS R50") },
  { name: "Canon EOS R6", price: 4068000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734185/zentra/products/canon_eos_r6.png", categoryId: 5, stock: 4, description: descriptionFor("Canon EOS R6") },
  { name: "Sony Alpha A6000", price: 1201000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735006/zentra/products/sony-alpha-a6000-silver.png", categoryId: 5, stock: 8, description: descriptionFor("Sony Alpha A6000") },
  { name: "Nikon D7500", price: 1663000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734699/zentra/products/nikon-d7500-yellow.png", categoryId: 5, stock: 5, description: descriptionFor("Nikon D7500") },
  { name: "DSLR Camera", price: 1108000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734416/zentra/products/dslr-camera-black.png", categoryId: 5, stock: 8, description: descriptionFor("DSLR Camera") },
  { name: "Compact Camera", price: 553000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734201/zentra/products/compact-camera-silver.png", categoryId: 5, stock: 10, description: descriptionFor("Compact Camera"), isOffer: true },
  { name: "Instant Camera", price: 220000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734487/zentra/products/instant-camera-white.png", categoryId: 5, stock: 12, description: descriptionFor("Instant Camera") },
  { name: "Action Camera 4K", price: 461000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734076/zentra/products/action-camera-4k-black.png", categoryId: 5, stock: 10, description: descriptionFor("Action Camera 4K") },
  { name: "Action Camera", price: 368000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734079/zentra/products/action-camera-black.png", categoryId: 5, stock: 10, description: descriptionFor("Action Camera") },
  { name: "Motorola Camera", price: 350000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734680/zentra/products/motorola-camera-black.png", categoryId: 5, stock: 9, description: descriptionFor("Motorola Camera") },

  { name: "Canon Pixma MG3620", price: 183000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734178/zentra/products/canon-pixma-mg3620-red.png", categoryId: 6, stock: 12, description: descriptionFor("Canon Pixma MG3620") },
  { name: "Brother Laser MFP", price: 424000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734145/zentra/products/brother-laser-mfp-gray.png", categoryId: 6, stock: 8, description: descriptionFor("Brother Laser MFP") },
  { name: "Epson EcoTank L3250", price: 461000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734421/zentra/products/epson-ecotank-l3250.png", categoryId: 6, stock: 10, description: descriptionFor("Epson EcoTank L3250") },
  { name: "HP OfficeJet 8030", price: 331000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734461/zentra/products/hp-officejet-8030-blue-white.png", categoryId: 6, stock: 9, description: descriptionFor("HP OfficeJet 8030"), isOffer: true },
  { name: "Printer Multifunction", price: 294000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734782/zentra/products/printer-multifunction-white.png", categoryId: 6, stock: 10, description: descriptionFor("Printer Multifunction") },
  { name: "Printer Laser Office", price: 553000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734770/zentra/products/printer-laser-office.png", categoryId: 6, stock: 7, description: descriptionFor("Printer Laser Office") },
  { name: "Compact Laser Printer", price: 331000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734759/zentra/products/printer-laser-compact-white.png", categoryId: 6, stock: 8, description: descriptionFor("Compact Laser Printer") },
  { name: "Inkjet Printer", price: 220000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734751/zentra/products/printer-inkjet-black.png", categoryId: 6, stock: 11, description: descriptionFor("Inkjet Printer") },
  { name: "Compact Home Printer", price: 183000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734742/zentra/products/printer-compact-home-white.png", categoryId: 6, stock: 12, description: descriptionFor("Compact Home Printer") },

  { name: "ASUS ProArt Monitor 4K", price: 1293000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734124/zentra/products/asus-proart-monitor-4k.png", categoryId: 7, stock: 8, description: descriptionFor("ASUS ProArt Monitor 4K") },
  { name: "Dell UltraSharp Monitor", price: 1108000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734402/zentra/products/dell-ultrasharp-monitor.png", categoryId: 7, stock: 9, description: descriptionFor("Dell UltraSharp Monitor") },
  { name: "LG Monitor 4K", price: 738000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734621/zentra/products/lg-monitor-4k.png", categoryId: 7, stock: 10, description: descriptionFor("LG Monitor 4K") },
  { name: "Samsung Monitor 32 4K", price: 794000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734803/zentra/products/samsung-monitor-32-4k.png", categoryId: 7, stock: 9, description: descriptionFor("Samsung Monitor 32 4K") },
  { name: "Corsair Ultrawide Monitor", price: 1478000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734220/zentra/products/corsair-ultrawide-monitor.png", categoryId: 7, stock: 5, description: descriptionFor("Corsair Ultrawide Monitor") },
  { name: "MSI Curved Gaming Monitor", price: 1016000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734693/zentra/products/msi-curved-monitor-gaming.png", categoryId: 7, stock: 7, description: descriptionFor("MSI Curved Gaming Monitor"), isOffer: true },
  { name: "Portable USB-C Monitor", price: 461000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734735/zentra/products/portable-monitor-usbc.png", categoryId: 7, stock: 10, description: descriptionFor("Portable USB-C Monitor") },
  { name: "Ultrawide Curved Monitor", price: 1293000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735012/zentra/products/ultrawide-monitor-curved.png", categoryId: 7, stock: 6, description: descriptionFor("Ultrawide Curved Monitor") },
  { name: "Gaming RGB Monitor", price: 923000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734435/zentra/products/gaming-monitor-rgb-white.png", categoryId: 7, stock: 8, description: descriptionFor("Gaming RGB Monitor") },

  { name: "Samsung SSD 1TB", price: 239000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734813/zentra/products/samsung_ssd_1tb.png", categoryId: 8, stock: 15, description: descriptionFor("Samsung SSD 1TB") },
  { name: "Kingston NV2 SSD", price: 165000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734578/zentra/products/kingston-nv2-ssd.png", categoryId: 8, stock: 18, description: descriptionFor("Kingston NV2 SSD") },
  { name: "Crucial Portable SSD", price: 220000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734229/zentra/products/crucial-portable-ssd-blue.png", categoryId: 8, stock: 14, description: descriptionFor("Crucial Portable SSD") },
  { name: "SanDisk Extreme Portable SSD", price: 257000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734817/zentra/products/sandisk-extreme-portable-ssd.png", categoryId: 8, stock: 13, description: descriptionFor("SanDisk Extreme Portable SSD") },
  { name: "WD Portable SSD", price: 239000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735009/zentra/products/wd-ssd-portable.png", categoryId: 8, stock: 14, description: descriptionFor("WD Portable SSD") },
  { name: "Seagate Portable HDD", price: 146000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734997/zentra/products/seagate-hdd-portable.png", categoryId: 8, stock: 20, description: descriptionFor("Seagate Portable HDD") },
  { name: "Toshiba Canvio Basics 1TB", price: 128000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735004/zentra/products/toshiba-canvio-basics-1tb.png", categoryId: 8, stock: 20, description: descriptionFor("Toshiba Canvio Basics 1TB") },
  { name: "SanDisk USB Pendrive", price: 35000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734822/zentra/products/sandisk-pendrive-usb.png", categoryId: 8, stock: 25, description: descriptionFor("SanDisk USB Pendrive"), isOffer: true },

  { name: "Logitech Wireless Mouse", price: 72000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734631/zentra/products/logitech-mouse-wireless-black.png", categoryId: 9, stock: 20, description: descriptionFor("Logitech Wireless Mouse") },
  { name: "Logitech G435", price: 146000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734625/zentra/products/logitech-g435.png", categoryId: 9, stock: 15, description: descriptionFor("Logitech G435") },
  { name: "Mechanical RGB Keyboard", price: 202000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734662/zentra/products/mechanical-keyboard-rgb.png", categoryId: 9, stock: 15, description: descriptionFor("Mechanical RGB Keyboard") },
  { name: "MagSafe Charger Stand", price: 91000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734654/zentra/products/magsafe-charger-stand-white.png", categoryId: 9, stock: 18, description: descriptionFor("MagSafe Charger Stand") },
  { name: "USB-C Hub 6 in 1", price: 109000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735005/zentra/products/usb-c-hub-6in1.png", categoryId: 9, stock: 18, description: descriptionFor("USB-C Hub 6 in 1") },
  { name: "USB Webcam Full HD", price: 128000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781735013/zentra/products/usb-webcam-full-hd-black.png", categoryId: 9, stock: 14, description: descriptionFor("USB Webcam Full HD") },
  { name: "LaCie Rugged External Drive", price: 276000, image: "https://res.cloudinary.com/daxxgponq/image/upload/v1781734585/zentra/products/lacie-rugged-external-drive-orange.png", categoryId: 9, stock: 12, description: descriptionFor("LaCie Rugged External Drive") },
];

export const preLoadProducts = async () => {
  const products = await ProductRepository.find();
  const existingProductsByName = new Map(
    products.map((product) => [product.name, product])
  );
  const missingProducts: IProduct[] = [];
  let updatedProducts = 0;

  for (const productToPreLoad of productsToPreLoad) {
    const existingProduct = existingProductsByName.get(productToPreLoad.name);

    if (!existingProduct) {
      missingProducts.push(productToPreLoad);
      continue;
    }

    let changed = false;
    const fieldsToSync: (keyof Pick<
      IProduct,
      "price" | "description" | "image" | "categoryId" | "isOffer"
    >)[] = ["price", "description", "image", "categoryId", "isOffer"];

    for (const field of fieldsToSync) {
      const nextValue =
        field === "isOffer" ? Boolean(productToPreLoad.isOffer) : productToPreLoad[field];

      if (existingProduct[field] !== nextValue) {
        existingProduct[field] = nextValue as never;
        changed = true;
      }
    }

    if (changed) {
      await ProductRepository.save(existingProduct);
      updatedProducts += 1;
    }
  }

  if (!missingProducts.length) {
    console.log(`Products already exist, ${updatedProducts} products updated`);
    return;
  }

  await AppDataSource.createQueryBuilder()
    .insert()
    .into(Product)
    .values(missingProducts)
    .execute();

  console.log(
    `${missingProducts.length} products preloaded, ${updatedProducts} products updated`
  );
};
