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
  { name: "iPhone 11", price: 699, image: "/images/iphone-11.png", categoryId: 1, stock: 10, description: descriptionFor("iPhone 11") },
  { name: "iPhone 14 Pro", price: 1099, image: "/images/iphone-14-pro-purple.png", categoryId: 1, stock: 8, description: descriptionFor("iPhone 14 Pro") },
  { name: "iPhone 15 Pro", price: 1299, image: "/images/iphone-15-pro.png", categoryId: 1, stock: 7, description: descriptionFor("iPhone 15 Pro") },
  { name: "Samsung Galaxy S23", price: 999, image: "/images/samsung_galaxy_s23.png", categoryId: 1, stock: 9, description: descriptionFor("Samsung Galaxy S23") },
  { name: "Galaxy S23", price: 949, image: "/images/galaxy-s23.png", categoryId: 1, stock: 6, description: descriptionFor("Galaxy S23") },
  { name: "Google Pixel 8 Pro", price: 899, image: "/images/google-pixel-8-pro.png", categoryId: 1, stock: 8, description: descriptionFor("Google Pixel 8 Pro") },
  { name: "Pixel 8", price: 749, image: "/images/pixel-8.png", categoryId: 1, stock: 10, description: descriptionFor("Pixel 8") },
  { name: "OnePlus 12", price: 799, image: "/images/oneplus-12.png", categoryId: 1, stock: 7, description: descriptionFor("OnePlus 12") },
  { name: "Nothing Phone 2", price: 699, image: "/images/nothing-phone-2.png", categoryId: 1, stock: 8, description: descriptionFor("Nothing Phone 2") },
  { name: "Motorola Edge 50 Pro", price: 649, image: "/images/motorola-edge-50-pro.png", categoryId: 1, stock: 9, description: descriptionFor("Motorola Edge 50 Pro") },
  { name: "Xiaomi 14 Pro", price: 799, image: "/images/xiaomi-14-pro.png", categoryId: 1, stock: 8, description: descriptionFor("Xiaomi 14 Pro"), isOffer: true },

  { name: "MacBook Air", price: 999, image: "/images/macbook-air.png", categoryId: 2, stock: 10, description: descriptionFor("MacBook Air") },
  { name: "MacBook Air M2", price: 1199, image: "/images/macbook-air-2.png", categoryId: 2, stock: 7, description: descriptionFor("MacBook Air M2") },
  { name: "MacBook Pro M2", price: 1899, image: "/images/macbook_pro_m2.png", categoryId: 2, stock: 6, description: descriptionFor("MacBook Pro M2") },
  { name: "Dell XPS 13", price: 1399, image: "/images/dell-xps-13.png", categoryId: 2, stock: 7, description: descriptionFor("Dell XPS 13") },
  { name: "Dell Inspiron 15", price: 799, image: "/images/dell-inspiron-15.png", categoryId: 2, stock: 10, description: descriptionFor("Dell Inspiron 15") },
  { name: "Acer Swift 3", price: 749, image: "/images/acer-swift-3.png", categoryId: 2, stock: 9, description: descriptionFor("Acer Swift 3") },
  { name: "HP Spectre x360", price: 1299, image: "/images/hp-spectre-x360.png", categoryId: 2, stock: 5, description: descriptionFor("HP Spectre x360") },
  { name: "Lenovo Legion 5 Pro", price: 1499, image: "/images/lenovo-legion-5-pro.png", categoryId: 2, stock: 6, description: descriptionFor("Lenovo Legion 5 Pro") },
  { name: "ASUS ROG Gamer", price: 1599, image: "/images/asus-rog-gamer.png", categoryId: 2, stock: 5, description: descriptionFor("ASUS ROG Gamer"), isOffer: true },
  { name: "Microsoft Surface Laptop 5", price: 1199, image: "/images/microsoft-surface-laptop-5.png", categoryId: 2, stock: 8, description: descriptionFor("Microsoft Surface Laptop 5") },
  { name: "Samsung Galaxy Book3 Ultra", price: 1799, image: "/images/samsung-galaxy-book3-ultra.png", categoryId: 2, stock: 4, description: descriptionFor("Samsung Galaxy Book3 Ultra") },

  { name: "iPad Pro", price: 799, image: "/images/ipad-pro.png", categoryId: 3, stock: 10, description: descriptionFor("iPad Pro") },
  { name: "iPad Pro 12.9", price: 999, image: "/images/ipad-pro2.png", categoryId: 3, stock: 8, description: descriptionFor("iPad Pro 12.9") },
  { name: "iPad Air", price: 699, image: "/images/ipad_air.png", categoryId: 3, stock: 9, description: descriptionFor("iPad Air") },
  { name: "Galaxy Tab S9 Ultra", price: 999, image: "/images/galaxy-tab-s9-ultra.png", categoryId: 3, stock: 7, description: descriptionFor("Galaxy Tab S9 Ultra") },
  { name: "Lenovo Tab P12 Pro", price: 579, image: "/images/lenovo-tab-p12-pro.png", categoryId: 3, stock: 9, description: descriptionFor("Lenovo Tab P12 Pro") },
  { name: "Huawei MatePad Pro", price: 649, image: "/images/huawei-matepad-pro.png", categoryId: 3, stock: 8, description: descriptionFor("Huawei MatePad Pro") },
  { name: "Google Pixel Tablet", price: 499, image: "/images/google-pixel-tablet.png", categoryId: 3, stock: 10, description: descriptionFor("Google Pixel Tablet") },
  { name: "OnePlus Pad", price: 479, image: "/images/oneplus-pad.png", categoryId: 3, stock: 9, description: descriptionFor("OnePlus Pad") },
  { name: "Xiaomi Pad 6", price: 399, image: "/images/xiaomi-pad-6.png", categoryId: 3, stock: 11, description: descriptionFor("Xiaomi Pad 6") },
  { name: "Amazon Fire HD 10", price: 199, image: "/images/amazon-fire-hd-10.png", categoryId: 3, stock: 12, description: descriptionFor("Amazon Fire HD 10"), isOffer: true },

  { name: "Apple Watch Series 6", price: 399, image: "/images/apple-watch-series-6.png", categoryId: 9, stock: 10, description: descriptionFor("Apple Watch Series 6") },

  { name: "AirPods Pro", price: 249, image: "/images/airpods-pro.png", categoryId: 4, stock: 10, description: descriptionFor("AirPods Pro") },
  { name: "AirPods Pro 2", price: 279, image: "/images/airpods-pro-2.png", categoryId: 4, stock: 9, description: descriptionFor("AirPods Pro 2") },
  { name: "Bose QuietComfort 45", price: 329, image: "/images/bose-quietcomfort-45.png", categoryId: 4, stock: 8, description: descriptionFor("Bose QuietComfort 45") },
  { name: "Beats Solo3 Wireless", price: 199, image: "/images/beats-solo3-wireless-pink.png", categoryId: 4, stock: 10, description: descriptionFor("Beats Solo3 Wireless") },
  { name: "Anker Soundcore Space One", price: 129, image: "/images/anker-soundcore-space-one.png", categoryId: 4, stock: 12, description: descriptionFor("Anker Soundcore Space One"), isOffer: true },
  { name: "JBL Tune 760NC", price: 149, image: "/images/jbl-tune-760nc.png", categoryId: 4, stock: 10, description: descriptionFor("JBL Tune 760NC") },
  { name: "Sony WH-1000XM5", price: 399, image: "/images/sony-wh1000xm5.png", categoryId: 4, stock: 7, description: descriptionFor("Sony WH-1000XM5") },
  { name: "Sony WF-C700N", price: 119, image: "/images/sony-wf-c700n-beige.png", categoryId: 4, stock: 11, description: descriptionFor("Sony WF-C700N") },
  { name: "Sennheiser Momentum 4", price: 349, image: "/images/sennheiser-momentum-4.png", categoryId: 4, stock: 7, description: descriptionFor("Sennheiser Momentum 4") },
  { name: "Motorola Headphones", price: 99, image: "/images/motorola-headphones-blue.png", categoryId: 4, stock: 12, description: descriptionFor("Motorola Headphones") },
  { name: "JBL Flip 6", price: 129, image: "/images/jbl-flip-6-blue.png", categoryId: 4, stock: 12, description: descriptionFor("JBL Flip 6") },
  { name: "HomePod mini", price: 99, image: "/images/homepod-mini.png", categoryId: 4, stock: 10, description: descriptionFor("HomePod mini") },

  { name: "Canon EOS R50", price: 799, image: "/images/canon-eos-r50.png", categoryId: 5, stock: 7, description: descriptionFor("Canon EOS R50") },
  { name: "Canon EOS R6", price: 2199, image: "/images/canon_eos_r6.png", categoryId: 5, stock: 4, description: descriptionFor("Canon EOS R6") },
  { name: "Sony Alpha A6000", price: 649, image: "/images/sony-alpha-a6000-silver.png", categoryId: 5, stock: 8, description: descriptionFor("Sony Alpha A6000") },
  { name: "Nikon D7500", price: 899, image: "/images/nikon-d7500-yellow.png", categoryId: 5, stock: 5, description: descriptionFor("Nikon D7500") },
  { name: "DSLR Camera", price: 599, image: "/images/dslr-camera-black.png", categoryId: 5, stock: 8, description: descriptionFor("DSLR Camera") },
  { name: "Compact Camera", price: 299, image: "/images/compact-camera-silver.png", categoryId: 5, stock: 10, description: descriptionFor("Compact Camera"), isOffer: true },
  { name: "Instant Camera", price: 119, image: "/images/instant-camera-white.png", categoryId: 5, stock: 12, description: descriptionFor("Instant Camera") },
  { name: "Action Camera 4K", price: 249, image: "/images/action-camera-4k-black.png", categoryId: 5, stock: 10, description: descriptionFor("Action Camera 4K") },
  { name: "Action Camera", price: 199, image: "/images/action-camera-black.png", categoryId: 5, stock: 10, description: descriptionFor("Action Camera") },
  { name: "Motorola Camera", price: 189, image: "/images/motorola-camera-black.png", categoryId: 5, stock: 9, description: descriptionFor("Motorola Camera") },

  { name: "Canon Pixma MG3620", price: 99, image: "/images/canon-pixma-mg3620-red.png", categoryId: 6, stock: 12, description: descriptionFor("Canon Pixma MG3620") },
  { name: "Brother Laser MFP", price: 229, image: "/images/brother-laser-mfp-gray.png", categoryId: 6, stock: 8, description: descriptionFor("Brother Laser MFP") },
  { name: "Epson EcoTank L3250", price: 249, image: "/images/epson-ecotank-l3250.png", categoryId: 6, stock: 10, description: descriptionFor("Epson EcoTank L3250") },
  { name: "HP OfficeJet 8030", price: 179, image: "/images/hp-officejet-8030-blue-white.png", categoryId: 6, stock: 9, description: descriptionFor("HP OfficeJet 8030"), isOffer: true },
  { name: "Printer Multifunction", price: 159, image: "/images/printer-multifunction-white.png", categoryId: 6, stock: 10, description: descriptionFor("Printer Multifunction") },
  { name: "Printer Laser Office", price: 299, image: "/images/printer-laser-office.png", categoryId: 6, stock: 7, description: descriptionFor("Printer Laser Office") },
  { name: "Compact Laser Printer", price: 179, image: "/images/printer-laser-compact-white.png", categoryId: 6, stock: 8, description: descriptionFor("Compact Laser Printer") },
  { name: "Inkjet Printer", price: 119, image: "/images/printer-inkjet-black.png", categoryId: 6, stock: 11, description: descriptionFor("Inkjet Printer") },
  { name: "Compact Home Printer", price: 99, image: "/images/printer-compact-home-white.png", categoryId: 6, stock: 12, description: descriptionFor("Compact Home Printer") },

  { name: "ASUS ProArt Monitor 4K", price: 699, image: "/images/asus-proart-monitor-4k.png", categoryId: 7, stock: 8, description: descriptionFor("ASUS ProArt Monitor 4K") },
  { name: "Dell UltraSharp Monitor", price: 599, image: "/images/dell-ultrasharp-monitor.png", categoryId: 7, stock: 9, description: descriptionFor("Dell UltraSharp Monitor") },
  { name: "LG Monitor 4K", price: 399, image: "/images/lg-monitor-4k.png", categoryId: 7, stock: 10, description: descriptionFor("LG Monitor 4K") },
  { name: "Samsung Monitor 32 4K", price: 429, image: "/images/samsung-monitor-32-4k.png", categoryId: 7, stock: 9, description: descriptionFor("Samsung Monitor 32 4K") },
  { name: "Corsair Ultrawide Monitor", price: 799, image: "/images/corsair-ultrawide-monitor.png", categoryId: 7, stock: 5, description: descriptionFor("Corsair Ultrawide Monitor") },
  { name: "MSI Curved Gaming Monitor", price: 549, image: "/images/msi-curved-monitor-gaming.png", categoryId: 7, stock: 7, description: descriptionFor("MSI Curved Gaming Monitor"), isOffer: true },
  { name: "Portable USB-C Monitor", price: 249, image: "/images/portable-monitor-usbc.png", categoryId: 7, stock: 10, description: descriptionFor("Portable USB-C Monitor") },
  { name: "Ultrawide Curved Monitor", price: 699, image: "/images/ultrawide-monitor-curved.png", categoryId: 7, stock: 6, description: descriptionFor("Ultrawide Curved Monitor") },
  { name: "Gaming RGB Monitor", price: 499, image: "/images/gaming-monitor-rgb-white.png", categoryId: 7, stock: 8, description: descriptionFor("Gaming RGB Monitor") },

  { name: "Samsung SSD 1TB", price: 129, image: "/images/samsung_ssd_1tb.png", categoryId: 8, stock: 15, description: descriptionFor("Samsung SSD 1TB") },
  { name: "Kingston NV2 SSD", price: 89, image: "/images/kingston-nv2-ssd.png", categoryId: 8, stock: 18, description: descriptionFor("Kingston NV2 SSD") },
  { name: "Crucial Portable SSD", price: 119, image: "/images/crucial-portable-ssd-blue.png", categoryId: 8, stock: 14, description: descriptionFor("Crucial Portable SSD") },
  { name: "SanDisk Extreme Portable SSD", price: 139, image: "/images/sandisk-extreme-portable-ssd.png", categoryId: 8, stock: 13, description: descriptionFor("SanDisk Extreme Portable SSD") },
  { name: "WD Portable SSD", price: 129, image: "/images/wd-ssd-portable.png", categoryId: 8, stock: 14, description: descriptionFor("WD Portable SSD") },
  { name: "Seagate Portable HDD", price: 79, image: "/images/seagate-hdd-portable.png", categoryId: 8, stock: 20, description: descriptionFor("Seagate Portable HDD") },
  { name: "Toshiba Canvio Basics 1TB", price: 69, image: "/images/toshiba-canvio-basics-1tb.png", categoryId: 8, stock: 20, description: descriptionFor("Toshiba Canvio Basics 1TB") },
  { name: "SanDisk USB Pendrive", price: 19, image: "/images/sandisk-pendrive-usb.png", categoryId: 8, stock: 25, description: descriptionFor("SanDisk USB Pendrive"), isOffer: true },

  { name: "Logitech Wireless Mouse", price: 39, image: "/images/logitech-mouse-wireless-black.png", categoryId: 9, stock: 20, description: descriptionFor("Logitech Wireless Mouse") },
  { name: "Logitech G435", price: 79, image: "/images/logitech-g435.png", categoryId: 9, stock: 15, description: descriptionFor("Logitech G435") },
  { name: "Mechanical RGB Keyboard", price: 109, image: "/images/mechanical-keyboard-rgb.png", categoryId: 9, stock: 15, description: descriptionFor("Mechanical RGB Keyboard") },
  { name: "MagSafe Charger Stand", price: 49, image: "/images/magsafe-charger-stand-white.png", categoryId: 9, stock: 18, description: descriptionFor("MagSafe Charger Stand") },
  { name: "USB-C Hub 6 in 1", price: 59, image: "/images/usb-c-hub-6in1.png", categoryId: 9, stock: 18, description: descriptionFor("USB-C Hub 6 in 1") },
  { name: "USB Webcam Full HD", price: 69, image: "/images/usb-webcam-full-hd-black.png", categoryId: 9, stock: 14, description: descriptionFor("USB Webcam Full HD") },
  { name: "LaCie Rugged External Drive", price: 149, image: "/images/lacie-rugged-external-drive-orange.png", categoryId: 9, stock: 12, description: descriptionFor("LaCie Rugged External Drive") },
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
