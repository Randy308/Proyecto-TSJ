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
            <input type="file" class="form-control @error('excelFile') is-invalid @enderror" id="excelFile"
                name="excelFile" accept=".xls,.xlsx,.csv">

            <!-- Mostrar el mensaje de error si la validación falla -->
            @error('excelFile')
                <div class="invalid-feedback">
                    {{ $message }}
                </div>
            @enderror
        </div>
        <button type="submit" class="btn btn-primary">Subir</button>
    </form>


    <div>
        <img src="{{ asset('/images/facultad.jpeg') }}" alt="Image" />
        <div>
            <div>
                Observatorio del derecho y la política boliviana
            </div>
            <div>
                Serie Cronologías jurídicas y políticas
            </div>
        </div>
        <img src="{{ asset('/images/iijp.png') }}" alt="Image" />
    </div>
    <form action="{{ route('excel.upload.jurisprudencia') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="form-group">
            <label for="excelFile">Selecciona un archivo Excel:</label>
            <input type="file" class="form-control @error('excelFile') is-invalid @enderror" id="excelFile"
                name="excelFile" accept=".xls,.xlsx,.csv">

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
