using System;
using System.Linq;

class Program
{
    static void Main()
    {
        Console.WriteLine("Mời bạn nhập danh sách số, cách nhau bởi dấu cách:");
        string input = Console.ReadLine();

        // Kiểm tra nếu chuỗi nhập vào rỗng hoặc null
        if (string.IsNullOrWhiteSpace(input))
        {
            Console.WriteLine("Không có dữ liệu để sắp xếp.");
            return;
        }

        // Chuyển chuỗi thành mảng số nguyên và sắp xếp
        int[] numbers = input.Split(' ')
                             .Where(x => int.TryParse(x, out _)) // Lọc giá trị hợp lệ
                             .Select(int.Parse)
                             .ToArray();

        Array.Sort(numbers); // Sắp xếp tăng dần

        Console.WriteLine("Danh sách sau khi sắp xếp:");
        Console.WriteLine(string.Join(" ", numbers));

        Console.ReadLine(); // Dừng màn hình để xem kết quả
    }
}
