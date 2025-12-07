import dicttoxml
from fastapi.responses import Response
import countries_pb2


def to_xml(data: dict):
    xml_bytes = dicttoxml.dicttoxml(
        data,
        custom_root="response",
        attr_type=False
    )
    return Response(content=xml_bytes, media_type="application/xml")


def to_protobuf(countries: list):
    proto_list = countries_pb2.CountryList()

    for c in countries:
        msg = proto_list.countries.add()
        msg.name = c["name"]
        msg.code = c["code"]
        msg.region = c["region"]
        msg.flag = c["flag"]

    return Response(
        content=proto_list.SerializeToString(),
        media_type="application/x-protobuf"
    )
