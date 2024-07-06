import Container from "@/components/ui/container";
import Billboard from "@/components/billboard";
import getBillboards from "@/actions/get-billboards";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/ui/product-list";

export const revalidate = 0;

const HomePage = async () => {
  const product = await getProducts({ isFeatured: true });
  const billboard = await getBillboards("0cf6a81f-41cc-4f84-b970-c427134d7087");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8 ">
          <ProductList title="Featured Products" items={[]} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
