import * as prettier from "prettier";


async function main() {
    const res = await prettier.format("let a = ", {semi: false, parser: "babel"});

    console.log(res)
}

main()
