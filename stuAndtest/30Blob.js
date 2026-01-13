// Syntax: new Blob(blobParts, options)
// 1.正常blob创建对象
// From a string
const textBlob1 = new Blob(["Hello, World!"], { type: "text/plain" });

// From multiple strings (they're concatenated)
const multiBlob = new Blob(["Hello, ", "World!"], { type: "text/plain" });

// From JSON data
const user = { name: "Alice", age: 30 };
const jsonBlob1 = new Blob([JSON.stringify(user, null, 2)], {
  type: "application/json",
});

// From HTML
const htmlBlob = new Blob(
  ["<!DOCTYPE html><html><body><h1>Hello</h1></body></html>"],
  { type: "text/html" }
);

// 2.FileReader 是一个异步 API，用于读取 Blob 和文件内容。它根据你想要的数据方式提供了不同的方法：文本内容或者图片读取
// 2.1 阅读文本内容
function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);

    reader.readAsText(file);
  });
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

// 2.2数据 URL 是一个包含以 base64 编码的文件数据的字符串。它可以直接作为图像的 src 属性使用：
// Image preview example
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");

imageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (file && file.type.startsWith("image/")) {
    const dataUrl = await readAsDataURL(file);
    preview.src = dataUrl; // Display the image
    // dataUrl looks like: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
});

// Usage with file input
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (file.type === "text/plain" || file.name.endsWith(".txt")) {
    const content = await readTextFile(file);
    console.log(content);
  }
});

// ============
// 3.最有用的 Blob 应用之一是在浏览器中生成可下载文件。密钥是 URL.createObjectURL（）
//每次 URL.createObjectURL（） 调用都会分配不会自动释放的内存。完成 URL 后一定要调用 URL.revokeObjectURL（）， 否则会泄露内存
function downloadBlob(blob, filename) {
  // Create a URL pointing to the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = url;
  link.download = filename; // Suggested filename

  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL (free memory)
  URL.revokeObjectURL(url);
}

// Download a text file
const textBlob = new Blob(["Hello, World!"], { type: "text/plain" });
downloadBlob(textBlob, "greeting.txt");

// Download JSON data
const data = { users: [{ name: "Alice" }, { name: "Bob" }] };
const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
  type: "application/json",
});
downloadBlob(jsonBlob, "users.json");
