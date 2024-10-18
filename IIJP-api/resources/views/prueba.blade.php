<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

    <form action="{{ route('excel.upload') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="form-group">
            <label for="excelFile">Selecciona un archivo Excel:</label>
            <input type="file" class="form-control @error('excelFile') is-invalid @enderror" id="excelFile" name="excelFile" accept=".xls,.xlsx,.csv">

            <!-- Mostrar el mensaje de error si la validación falla -->
            @error('excelFile')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>
        <button type="submit" class="btn btn-primary">Subir</button>
    </form>

</body>
</html>
