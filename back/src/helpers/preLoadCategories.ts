import { AppDataSource } from "../config/dataSource";
import { Category } from "../entities/Category";
import { CategoryRepository } from "../repositories/category.respository";

interface ICategory {
  name: string;
}

export const categoriesToPreLoad: ICategory[] = [
  {
    "name": "Vans"
  },
  {
    "name": "Puma"
  },
  {
    "name": "Asics"
  },
  {
    "name": "Nike"
  },
  {
    "name": "Adidas"
  },
  {
    "name": "New Balance"
  },
  {
    "name": "Botines"
  },
  {
    "name": "Ojotas"
  },
  {
    "name": "DC"
  },
  {
    "name": "Caterpillar"
  },
  {
    "name": "Louis Vuitton"
  },
  {
    "name": "Otros"
  }
];

export const preLoadCategories = async () => {
  const existingCategories = await CategoryRepository.find();
  const categoriesByName = new Map(
    existingCategories.map((category) => [category.name.toLowerCase(), category])
  );

  for (const categoryToPreLoad of categoriesToPreLoad) {
    if (!categoriesByName.has(categoryToPreLoad.name.toLowerCase())) {
      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Category)
        .values(categoryToPreLoad)
        .execute();
    }
  }

  console.log("Categories preloaded");
};
