using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace FileUploader
{
    public static class Util
    {
        public static readonly string UPLOAD_PATH;
        static Random rd = new Random();

        static Util() {
            UPLOAD_PATH = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
        }

        
        public class FileData
        {
            public string Name { get; set; }
            public string Mimetype { get; set; }
        }

        public static bool DoesFileExist(string file)
        {
            string f = Path.Combine(UPLOAD_PATH, file);
            return File.Exists(f) && File.Exists(f + ".json");
        }

        public static FileData GetFileData(string name)
        {
            if(!DoesFileExist(name))
            {
                return null;
            }

            string f = Path.Combine(UPLOAD_PATH, name + ".json");
            return JsonConvert.DeserializeObject<FileData>(File.ReadAllText(f));
        }

        public static string GenerateFileName()
        {
            const string allowedChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
            char[] chars = new char[16];

            for (int i = 0; i < 16; i++)
            {
                chars[i] = allowedChars[rd.Next(0, allowedChars.Length)];
            }

            return new string(chars);
        }

        public static FileResult GetFileResult(string name)
        {
            if (!DoesFileExist(name))
            {
                return null;
            }

            string f = Path.Combine(UPLOAD_PATH, name);

            FileData data = JsonConvert.DeserializeObject<FileData>(File.ReadAllText(f + ".json"));

            FileContentResult result = new FileContentResult(File.ReadAllBytes(f), data.Mimetype)
            {
                FileDownloadName = data.Name
            };

            return result;
        }

        public static string SaveFile(FormFile file)
        {
            string name = GenerateFileName();

            while(DoesFileExist(name))
            {
                name = GenerateFileName();
            }

            string path = Path.Combine(UPLOAD_PATH, name);
            string jsonPath = path + ".json";

            using (Stream stream = new FileStream(path, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            FileData data = new FileData()
            {
                Name = file.FileName,
                Mimetype = file.ContentType
            };

            File.WriteAllText(jsonPath, JsonConvert.SerializeObject(data));

            return name;
        }

        
    }
}
