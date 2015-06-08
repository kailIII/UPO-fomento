from model.base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
import base

class FamilyModel(PostgreSQLModel):
    
    def getFamilyList(self):
        sql = "SELECT f.cod_familia, name_familia, cod_indicador, name_indicador, description, (select count(*) from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador) as count, (select fecha from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador order by fecha limit 1) as fecha, (select count(*) from geoserver.indicador_grafica grafica where grafica.cod_indicador = i.cod_indicador) as graficas" \
                " from geoserver.familia f" \
                 " inner join geoserver.indicador i on i.cod_familia = f.cod_familia where i.tipo=1 order by cod_familia, orden";

        return self.query(sql).result()
    
    
    def getCartoTemListByFamyly(self):
        sql = "SELECT f.cod_familia, f.name_familia, p.cod_familia as fatherCod, p.name_familia as fatherName, cod_indicador, name_indicador, description, (select count(*) from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador) as count, (select fecha from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador order by fecha limit 1) as fecha, (select count(*) from geoserver.indicador_grafica grafica where grafica.cod_indicador = i.cod_indicador) as graficas" \
                " from geoserver.familia f" \
                 " inner join geoserver.indicador i on i.cod_familia = f.cod_familia " \
                 " left join geoserver.familia p on p.cod_familia = f.padre " \
                 "where i.tipo=2 order by f.cod_familia, orden";

        return self.query(sql).result()


    def mapBaseList(self):
        sql = "SELECT cod_indicador, name_indicador, description, (select count(*) from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador) as count, (select fecha from geoserver.indicador_fecha fecha where cod_indicador = i.cod_indicador order by fecha limit 1) as fecha, (select count(*) from geoserver.indicador_grafica grafica where grafica.cod_indicador = i.cod_indicador) as graficas" \
                " from geoserver.familia f" \
                 " inner join geoserver.indicador i on i.cod_familia = f.cod_familia where i.tipo=3 order by orden";

        return self.query(sql).result()
