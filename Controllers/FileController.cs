using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FileUploader.Controllers
{
    public class FileModel
    {
        public string FileName { get; set; }
        public IFormFile FormFile { get; set; }
    }

    [Route("file")]
    public class FileController : Controller
    {
        private readonly ILogger _logger;

        public FileController(ILogger<FileController> logger)
        {
            _logger = logger;
        }



        [Route("upload")]
        [HttpPost]
        [RequestSizeLimit(10L * 1024L * 1024L * 1024L)]
        [RequestFormLimits(MultipartBodyLengthLimit = 10L * 1024L * 1024L * 1024L)]
        public async Task<IActionResult> UploadFile([FromForm] FileModel file)
        {
            try
            {
                _logger.LogInformation("File Recieved");

                if(file == null || file.FormFile == null)
                {
                    _logger.LogInformation("No File");
                    return StatusCode(StatusCodes.Status400BadRequest);
                }

                string name = Util.SaveFile((FormFile)file.FormFile);
                _logger.LogInformation($"{file.FileName} -> {name}");
                return Ok(name);

            } catch(Exception e)
            {
                _logger.LogError(e.StackTrace);
                return StatusCode(StatusCodes.Status400BadRequest);
            }
        }

        [Route("download/{name}")]
        [HttpGet]
        public FileResult Download(string name)
        {
            return Util.GetFileResult(name);
        }

        [Route("info/{name}")]
        [HttpGet]
        public Util.FileData GetFileData(string name)
        {
            return Util.GetFileData(name);
        }
    }
}
